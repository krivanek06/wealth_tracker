import { AfterViewInit, ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { catchError, combineLatest, EMPTY, filter, first, map, Observable, startWith, switchMap, tap } from 'rxjs';
import { AssetApiService, InvestmentAccountFacadeApiService } from '../../../../core/api';
import {
	AssetGeneralFragment,
	InvestmentAccounHoldingCreateInput,
	InvestmentAccountFragment,
	InvestmentAccountHoldingHistoryType,
	InvestmentAccountTransactionOutput,
} from '../../../../core/graphql';
import { DialogServiceUtil } from '../../../../shared/dialogs';
import {
	InputTypeDateTimePickerConfig,
	minValueValidator,
	positiveNumberValidator,
	requiredValidator,
} from '../../../../shared/models';
import { DateServiceUtil } from '../../../../shared/utils';
import { SearchableAssetEnum } from '../../../asset-manager/models';
import { CashAllocation } from '../../models';
import { InvestmentAccountCalculatorService } from '../../services';

@Component({
	selector: 'app-investment-account-holding',
	templateUrl: './investment-account-holding.component.html',
	styleUrls: ['./investment-account-holding.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvestmentAccountHoldingComponent implements OnInit, AfterViewInit {
	formGroup = new FormGroup({
		transactionType: new FormControl<InvestmentAccountHoldingHistoryType>(InvestmentAccountHoldingHistoryType.Buy, {
			validators: [requiredValidator],
			nonNullable: true,
		}),
		assetType: new FormControl<SearchableAssetEnum>(SearchableAssetEnum.AseetById, {
			validators: [requiredValidator],
			nonNullable: true,
		}),
		symbol: new FormControl<AssetGeneralFragment | null>(null, { validators: [Validators.required] }),
		symbolPrice: new FormControl<number>(0, { validators: [Validators.required], nonNullable: true }),
		units: new FormControl<number>(0, {
			validators: [requiredValidator, positiveNumberValidator, minValueValidator(1)],
			nonNullable: true,
		}),
		date: new FormControl<Date>(new Date(), { validators: [requiredValidator], nonNullable: true }),
	});

	investmentAccount$!: Observable<InvestmentAccountFragment>;
	transactionHistory$!: Observable<InvestmentAccountTransactionOutput[]>;

	// display different categories and accumulated cash for them
	cashCategory$!: Observable<CashAllocation>;
	cashError$!: Observable<boolean>;

	// used to show loader
	isSaving = false;

	SearchableAssetEnum = SearchableAssetEnum;
	InvestmentAccountHoldingHistoryType = InvestmentAccountHoldingHistoryType;

	datePickerConfig: InputTypeDateTimePickerConfig = {
		maxDate: new Date(),
		dateFilter: DateServiceUtil.isNotWeekend,
	};

	get formSymbol(): FormControl {
		return this.formGroup.controls.symbol;
	}

	get formAssetType(): FormControl {
		return this.formGroup.controls.assetType;
	}

	get formDate(): FormControl {
		return this.formGroup.controls.date;
	}

	get formSymbolPrice(): FormControl {
		return this.formGroup.controls.symbolPrice;
	}

	get formTransactionType(): FormControl {
		return this.formGroup.controls.transactionType;
	}

	get totalValue(): number {
		if (!this.formGroup.controls.symbol.value) {
			return 0;
		}
		return this.formSymbolPrice.value * this.formGroup.controls.units.value;
	}

	constructor(
		private investmentAccountFacadeApiService: InvestmentAccountFacadeApiService,
		private investmentAccountCalculatorService: InvestmentAccountCalculatorService,
		private assetApiService: AssetApiService,
		private dialogRef: MatDialogRef<InvestmentAccountHoldingComponent>,
		@Inject(MAT_DIALOG_DATA) public data: { investmentId: string; selectedAsset?: AssetGeneralFragment }
	) {}
	ngAfterViewInit(): void {
		// load values for selected asset
		setTimeout(() => {
			if (this.data.selectedAsset) {
				this.formSymbol.patchValue(this.data.selectedAsset);
				this.formAssetType.patchValue(SearchableAssetEnum.AseetById);
			}
		});
	}

	ngOnInit(): void {
		this.investmentAccount$ = this.investmentAccountFacadeApiService.getInvestmentAccountById(this.data.investmentId);

		// build cash categories
		this.cashCategory$ = this.investmentAccount$.pipe(
			map((account) => this.investmentAccountCalculatorService.getCashCategories(account))
		);

		// on form change check if user has enough cash
		this.cashError$ = this.formGroup.valueChanges.pipe(
			switchMap(() =>
				this.cashCategory$.pipe(
					map(
						(c) =>
							c.DEPOSIT + c.ASSET_OPERATION - c.WITHDRAWAL < this.totalValue &&
							this.formTransactionType.value === InvestmentAccountHoldingHistoryType.Buy
					)
				)
			)
		);

		// on symbol pick load transaction history
		this.transactionHistory$ = this.formSymbol.valueChanges.pipe(
			startWith(this.formSymbol.value),
			switchMap((value: AssetGeneralFragment) =>
				this.investmentAccountFacadeApiService
					.getTransactionHistory(this.data.investmentId)
					.pipe(map((transactions) => transactions.filter((d) => (!!value ? d.assetId === value.id : false))))
			)
		);

		// IDK why, but keep data in ngAfterViewInit because it just works
		if (this.data.selectedAsset) {
			this.formSymbol.patchValue(this.data.selectedAsset);
			this.formAssetType.patchValue(SearchableAssetEnum.AseetById);
		}

		// monitor symbol and date change and load price for a specific date
		combineLatest([
			this.formSymbol.valueChanges.pipe(startWith(this.formSymbol.value)),
			this.formDate.valueChanges.pipe(startWith(this.formDate.value)),
		])
			.pipe(
				filter(([asset, date]: [AssetGeneralFragment, Date]) => !!asset && !!date),
				switchMap(([asset, date]: [AssetGeneralFragment, Date]) =>
					this.assetApiService
						.getAssetGeneralHistoricalPricesDataOnDate(asset.id, DateServiceUtil.formatDate(date))
						.pipe(map((res) => res.close))
				)
			)
			.subscribe((assetPrice) => {
				console.log(assetPrice);
				this.formSymbolPrice.patchValue(assetPrice);
			});
	}

	onSave(): void {
		const controls = this.formGroup.controls;
		this.formGroup.markAllAsTouched();

		if (this.formGroup.invalid || !controls.symbol.value) {
			return;
		}

		this.isSaving = true;

		const input: InvestmentAccounHoldingCreateInput = {
			investmentAccountId: this.data.investmentId,
			isCrypto: controls.assetType.value === SearchableAssetEnum.Crypto,
			symbol: controls.symbol.value.id,
			type: controls.transactionType.value,
			holdingInputData: {
				date: DateServiceUtil.formatDate(controls.date.value),
				units: controls.units.value,
			},
		};

		// notify user
		DialogServiceUtil.showNotificationBar(`Saving holding for ${controls.symbol.value.id}`, 'notification');

		// save holding
		this.investmentAccountFacadeApiService
			.createInvestmentAccountHolding(input)
			.pipe(
				tap(() => {
					this.isSaving = false;
					DialogServiceUtil.showNotificationBar(`Holding history has been saved`);
					// trigger value change to load transactionHistory again
					this.formSymbol.patchValue(this.formSymbol.value);
				}),
				// client error message
				catchError(() => {
					this.isSaving = false;
					return EMPTY;
				}),
				// memory leak
				first()
			)
			.subscribe();
	}

	onDelete(history: InvestmentAccountTransactionOutput): void {
		this.investmentAccountFacadeApiService
			.deleteInvestmentAccountHolding(this.data.investmentId, history)
			.pipe(
				tap(() => {
					DialogServiceUtil.showNotificationBar(`Holding history has been removed`);
				}),
				// memory leak
				first()
			)
			.subscribe();
	}
}

import { AfterViewInit, ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { catchError, EMPTY, first, map, Observable, of, startWith, switchMap, tap } from 'rxjs';
import { InvestmentAccountFacadeApiService } from '../../../../core/api';
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

	maxDateSymbolPurchase: InputTypeDateTimePickerConfig = {
		maxDate: new Date(),
	};

	get totalValue(): number {
		if (!this.formGroup.controls.symbol.value) {
			return 0;
		}
		return this.formGroup.controls.symbol.value.assetQuote.price * this.formGroup.controls.units.value;
	}

	constructor(
		private investmentAccountFacadeApiService: InvestmentAccountFacadeApiService,
		private investmentAccountCalculatorService: InvestmentAccountCalculatorService,
		private dialogRef: MatDialogRef<InvestmentAccountHoldingComponent>,
		@Inject(MAT_DIALOG_DATA) public data: { investmentId: string; selectedAsset?: AssetGeneralFragment }
	) {}
	ngAfterViewInit(): void {
		// load values for selected asset
		setTimeout(() => {
			if (this.data.selectedAsset) {
				this.formGroup.controls.symbol.patchValue(this.data.selectedAsset);
				this.formGroup.controls.assetType.patchValue(SearchableAssetEnum.AseetById);
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
				this.cashCategory$.pipe(map((c) => c.DEPOSIT + c.ASSET_OPERATION - c.WITHDRAWAL < this.totalValue))
			)
		);

		// on symbol pick load transaction history
		this.transactionHistory$ = this.formGroup.controls.symbol.valueChanges.pipe(
			startWith(this.formGroup.controls.symbol.value),
			switchMap((value) =>
				!value
					? of([])
					: this.investmentAccountFacadeApiService.getTransactionHistory({
							accountId: this.data.investmentId,
							filterSymbols: [value.id],
					  })
			)
		);

		// IDK why, but keep data in ngAfterViewInit because it just works
		if (this.data.selectedAsset) {
			this.formGroup.controls.symbol.patchValue(this.data.selectedAsset);
			this.formGroup.controls.assetType.patchValue(SearchableAssetEnum.AseetById);
		}

		// TODO: based on date change - load selected symbol price
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

		this.investmentAccountFacadeApiService
			.createInvestmentAccountHolding(input)
			.pipe(
				tap(() => {
					this.isSaving = false;
					DialogServiceUtil.showNotificationBar(`Holding history has been saved`);
				}),
				// client error message
				catchError(() => {
					this.isSaving = false;
					DialogServiceUtil.showNotificationBar(`Unable to perform the action`, 'error');
					return EMPTY;
				}),
				// memory leak
				first()
			)
			.subscribe();
	}

	onDelete(history: InvestmentAccountTransactionOutput): void {
		this.investmentAccountFacadeApiService
			.deleteInvestmentAccountHolding({
				investmentAccountId: this.data.investmentId,
				itemId: history.itemId,
				symbol: history.assetId,
			})
			.pipe(
				tap(() => {
					// force to reload history
					this.formGroup.controls.symbol.patchValue(this.formGroup.controls.symbol.value);
					DialogServiceUtil.showNotificationBar(`Holding history has been removed`);
				}),
				// memory leak
				first()
			)
			.subscribe();
	}
}

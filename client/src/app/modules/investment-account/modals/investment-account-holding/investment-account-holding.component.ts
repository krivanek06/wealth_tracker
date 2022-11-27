import { AfterViewInit, ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { first, map, Observable, of, startWith, switchMap, tap } from 'rxjs';
import { InvestmentAccountFacadeApiService } from '../../../../core/api';
import {
	AssetGeneralFragment,
	InvestmentAccountFragment,
	InvestmentAccountTransactionOutput,
} from '../../../../core/graphql';
import {
	InputTypeDateTimePickerConfig,
	minValueValidator,
	positiveNumberValidator,
	requiredValidator,
} from '../../../../shared/models';
import { SearchableAssetEnum } from '../../../asset-manager/models';
import { CashAllocation } from '../../models';
import { InvestmentAccountCalculatorService } from '../../services';
import { DialogServiceUtil } from './../../../../shared/dialogs/dialog-service.util';

@Component({
	selector: 'app-investment-account-holding',
	templateUrl: './investment-account-holding.component.html',
	styleUrls: ['./investment-account-holding.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvestmentAccountHoldingComponent implements OnInit, AfterViewInit {
	formGroup = new FormGroup({
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
	}

	onSave(): void {
		this.formGroup.markAllAsTouched();
		if (this.formGroup.invalid) {
			return;
		}

		this.isSaving = true;
		const controls = this.formGroup.controls;

		// TODO BUY / SELL radio buttons

		// const input: InvestmentAccounHoldingCreateInput = {
		// 	investmentAccountId: this.data.investmentId,
		//   holdingType: controls.assetType.value,
		//   symbol: controls.symbol.value?.id,
		//   type: controls.
		// 	holdingInputData: {
		//     date: DateServiceUtil.formatDate(controls.date.value),
		//     units: controls.units.value
		//   }
		// };

		// this.investmentAccountFacadeApiService
		// 	.createInvestmentAccountHolding(input)
		// 	.pipe(
		// 		tap(() => {
		// 			this.isSaving = false;
		// 			DialogServiceUtil.showNotificationBar(`Cash entry has been saved`);
		// 		}),
		// 		// client error message
		// 		catchError(() => {
		// 			this.isSaving = false;
		// 			DialogServiceUtil.showNotificationBar(`Unable to perform the action`, 'error');
		// 			return EMPTY;
		// 		}),
		// 		// memory leak
		// 		first()
		// 	)
		// 	.subscribe();
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

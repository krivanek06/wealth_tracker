import { AfterViewInit, ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
	EMPTY,
	Observable,
	catchError,
	combineLatest,
	filter,
	first,
	map,
	merge,
	shareReplay,
	startWith,
	switchMap,
	takeUntil,
	tap,
} from 'rxjs';
import { componentDestroyed } from 'src/app/core/operators';
import { AssetApiService, InvestmentAccountFacadeApiService } from '../../../../core/api';
import {
	AssetGeneralFragment,
	InvestmentAccounHoldingCreateInput,
	InvestmentAccountActiveHoldingOutputFragment,
	InvestmentAccountHoldingHistoryType,
	InvestmentAccountHoldingType,
	InvestmentAccountTransactionOutput,
} from '../../../../core/graphql';
import { ColorScheme, InvestmentAccountFragmentExtended } from '../../../../core/models';
import { DateServiceUtil } from '../../../../core/utils';
import { DialogServiceUtil } from '../../../../shared/dialogs';
import {
	GenericChartSeries,
	InputTypeDateTimePickerConfig,
	minValueValidator,
	positiveNumberValidator,
	requiredValidator,
} from '../../../../shared/models';
import { SearchableAssetEnum } from '../../../asset-manager/models';
import { TransactionAssetTypeInputSource } from '../../models';
import { ActionButtonPressEnum } from './account-holding-modal.model';

@Component({
	selector: 'app-investment-account-holding',
	templateUrl: './investment-account-holding.component.html',
	styleUrls: ['./investment-account-holding.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvestmentAccountHoldingComponent implements OnInit, AfterViewInit, OnDestroy {
	formGroup = new FormGroup({
		isBuying: new FormControl<boolean>(true, {
			validators: [requiredValidator],
			nonNullable: true,
		}),
		assetType: new FormControl<SearchableAssetEnum>(SearchableAssetEnum.AseetById, {
			validators: [requiredValidator],
			nonNullable: true,
		}),
		symbol: new FormControl<AssetGeneralFragment | null>(null, { validators: [Validators.required] }),
		symbolPrice: new FormControl<number>(0, { validators: [Validators.required], nonNullable: true }),
		units: new FormControl<string>('', {
			validators: [requiredValidator, positiveNumberValidator, minValueValidator(1)],
			nonNullable: true,
		}),
		customTotalValue: new FormControl<string>(''),
		allowCustomTotalValue: new FormControl<boolean>(false, { nonNullable: true }),
		date: new FormControl<Date>(new Date(), { validators: [requiredValidator], nonNullable: true }),
	});

	investmentAccount$!: Observable<InvestmentAccountFragmentExtended>;
	transactionHistory$!: Observable<InvestmentAccountTransactionOutput[]>;
	assetHistoricalData$!: Observable<GenericChartSeries>;

	// used to show loader
	isSaving = false;

	TransactionAssetTypeInputSource = TransactionAssetTypeInputSource;

	SearchableAssetEnum = SearchableAssetEnum;

	showHistoricalTransactions = false;

	// error
	insufficientUnitsError$!: Observable<boolean>;
	isError$!: Observable<boolean>;

	datePickerConfig: InputTypeDateTimePickerConfig = {
		maxDate: new Date(),
		minDate: new Date(2015, 0, 1),
		dateFilter: DateServiceUtil.isNotWeekend,
	};

	private startingDateLoadingHistoricalData: Date = DateServiceUtil.subYears(new Date(), 1);
	loadingHistoricalData = true;

	recordingActionButtonPressEnum = ActionButtonPressEnum.UNITS;

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

	get isBuying(): FormControl {
		return this.formGroup.controls.isBuying;
	}

	get units(): FormControl {
		return this.formGroup.controls.units;
	}

	get allowCustomTotalValue(): FormControl {
		return this.formGroup.controls.allowCustomTotalValue;
	}

	get calculatedTotalValue(): number {
		if (!this.formSymbolPrice.value) {
			return 0;
		}
		return this.formSymbolPrice.value * Number(this.units.value);
	}

	get isCustomTotalValue(): boolean {
		return this.recordingActionButtonPressEnum === ActionButtonPressEnum.TOTAL_VALUE;
	}

	get keyBoardFormControl(): FormControl {
		if (this.isCustomTotalValue) {
			return this.formGroup.controls.customTotalValue;
		}
		return this.formGroup.controls.units;
	}

	constructor(
		private investmentAccountFacadeApiService: InvestmentAccountFacadeApiService,
		private assetApiService: AssetApiService,
		private dialogRef: MatDialogRef<InvestmentAccountHoldingComponent>,
		@Inject(MAT_DIALOG_DATA)
		public data: { activeHolding?: InvestmentAccountActiveHoldingOutputFragment }
	) {}

	ngOnDestroy(): void {}

	ngAfterViewInit(): void {
		// load values for selected asset
		setTimeout(() => {
			this.setActiveHoldingToForm();
		});
	}

	ngOnInit(): void {
		this.investmentAccount$ = this.investmentAccountFacadeApiService.getInvestmentAccountByUser();

		// check if user has enough units to sell
		this.insufficientUnitsError$ = this.formGroup.valueChanges.pipe(
			switchMap(() =>
				this.investmentAccount$.pipe(
					map(
						() => !!this.data.activeHolding && !this.isBuying.value && this.units.value > this.data.activeHolding.units
					)
				)
			)
		);

		// loading historical data
		this.assetHistoricalData$ = combineLatest([
			this.formSymbol.valueChanges.pipe(startWith(this.formSymbol.value)),
			this.formDate.valueChanges.pipe(startWith(this.formDate.value)),
		]).pipe(
			filter(([asset, date]: [AssetGeneralFragment, Date]) => !!asset && !!date),
			tap(() => (this.loadingHistoricalData = true)),
			switchMap(([asset, date]: [AssetGeneralFragment, Date]) =>
				this.assetApiService
					.getAssetHistoricalPricesStartToEnd({
						symbol: asset.id,
						start: DateServiceUtil.isBefore(date, this.startingDateLoadingHistoricalData)
							? DateServiceUtil.formatDate(date)
							: DateServiceUtil.formatDate(this.startingDateLoadingHistoricalData),
						end: DateServiceUtil.formatDate(new Date()),
					})
					.pipe(
						map((res) => {
							const result: GenericChartSeries = {
								data: !!res
									? res.assetHistoricalPricesData.map((d) => [new Date(d.date).getTime(), d.close] as [number, number])
									: [],
								name: `Historical Price ${asset.id}`,
								color: ColorScheme.PRIMARY_VAR,
							};

							return result;
						})
					)
			),
			tap(() => (this.loadingHistoricalData = false)),
			shareReplay({ bufferSize: 1, refCount: false })
		);

		// merge errors together
		this.isError$ = merge(this.insufficientUnitsError$);

		// on symbol pick load transaction history
		this.transactionHistory$ = this.formSymbol.valueChanges.pipe(
			startWith(this.formSymbol.value),
			switchMap((value: AssetGeneralFragment) =>
				this.investmentAccountFacadeApiService
					.getTransactionHistory()
					.pipe(map((transactions) => transactions.filter((d) => (!!value ? d.assetId === value.id : false))))
			)
		);

		// IDK why, but keep data in ngAfterViewInit because it just works
		if (this.data.activeHolding) {
			this.setActiveHoldingToForm();
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
				),
				takeUntil(componentDestroyed(this))
			)
			.subscribe((assetPrice) => {
				this.formSymbolPrice.patchValue(assetPrice);
			});
	}

	onTransactionTypeChange(): void {
		const value = this.formGroup.controls.isBuying.value;
		this.formGroup.controls.isBuying.patchValue(!value);
	}

	onRecordStateAction(type: ActionButtonPressEnum): void {
		this.recordingActionButtonPressEnum = type;
	}

	onCancel(): void {
		this.dialogRef.close();
	}

	onTransactionShow(): void {
		this.showHistoricalTransactions = !this.showHistoricalTransactions;
	}

	onSave(): void {
		const controls = this.formGroup.controls;
		this.formGroup.markAllAsTouched();

		if (this.formGroup.invalid || !controls.symbol.value) {
			return;
		}

		this.isSaving = true;

		const input: InvestmentAccounHoldingCreateInput = {
			isCrypto: controls.assetType.value === SearchableAssetEnum.Crypto,
			symbol: controls.symbol.value.id,
			type: controls.isBuying.value
				? InvestmentAccountHoldingHistoryType.Buy
				: InvestmentAccountHoldingHistoryType.Sell,
			holdingInputData: {
				date: DateServiceUtil.formatDate(controls.date.value),
				units: Number(controls.units.value),
			},
			customTotalValue: controls.allowCustomTotalValue.value ? Number(controls.customTotalValue.value) : null,
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
			.subscribe(() => {
				this.dialogRef.close();
			});
	}

	onDelete(history: InvestmentAccountTransactionOutput): void {
		this.investmentAccountFacadeApiService
			.deleteInvestmentAccountHolding(history)
			.pipe(
				tap(() => {
					DialogServiceUtil.showNotificationBar(`Holding history has been removed`);
				}),
				// memory leak
				first()
			)
			.subscribe();
	}

	private setActiveHoldingToForm(): void {
		if (this.data.activeHolding) {
			const type =
				this.data.activeHolding.type === InvestmentAccountHoldingType.Crypto
					? SearchableAssetEnum.Crypto
					: SearchableAssetEnum.AseetById;
			this.formSymbol.patchValue(this.data.activeHolding.assetGeneral);
			this.formAssetType.patchValue(type);
		}
	}
}

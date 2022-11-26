import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map, Observable, switchMap } from 'rxjs';
import { InvestmentAccountApiService } from '../../../../core/api';
import { AssetGeneralFragment, InvestmentAccountFragment } from '../../../../core/graphql';
import {
	InputTypeDateTimePickerConfig,
	minValueValidator,
	positiveNumberValidator,
	requiredValidator,
} from '../../../../shared/models';
import { SearchableAssetEnum } from '../../../asset-manager/models';
import { CashAllocation } from '../../models';
import { InvestmentAccountCalculatorService } from '../../services';

@Component({
	selector: 'app-investment-account-holding',
	templateUrl: './investment-account-holding.component.html',
	styleUrls: ['./investment-account-holding.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvestmentAccountHoldingComponent implements OnInit {
	formGroup = new FormGroup({
		assetType: new FormControl<SearchableAssetEnum>(SearchableAssetEnum.AseetByName, {
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

	// display different categories and accumulated cash for them
	cashCategory$!: Observable<CashAllocation>;

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

	cashError$!: Observable<boolean>;

	constructor(
		private investmentAccountApiService: InvestmentAccountApiService,
		private investmentAccountCalculatorService: InvestmentAccountCalculatorService,
		private dialogRef: MatDialogRef<InvestmentAccountHoldingComponent>,
		@Inject(MAT_DIALOG_DATA) public data: { investmentId: string }
	) {}

	ngOnInit(): void {
		this.investmentAccount$ = this.investmentAccountApiService.getInvestmentAccountById(this.data.investmentId);

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
	}

	onSave(): void {
		this.formGroup.markAllAsTouched();
		if (this.formGroup.invalid) {
			return;
		}

		this.isSaving = true;
	}
}

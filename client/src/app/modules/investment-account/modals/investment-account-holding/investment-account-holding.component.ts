import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map, Observable } from 'rxjs';
import { InvestmentAccountApiService } from '../../../../core/api';
import { AssetGeneralFragment, InvestmentAccountFragment } from '../../../../core/graphql';
import { InputTypeDateTimePickerConfig, positiveNumberValidator, requiredValidator } from '../../../../shared/models';
import { CashAllocation, SearchableAssetEnum } from '../../models';
import { InvestmentAccountCalculatorService } from '../../services';
import { InvestmentAccountCashChangeComponent } from '../investment-account-cash-change/investment-account-cash-change.component';

@Component({
	selector: 'app-investment-account-holding',
	templateUrl: './investment-account-holding.component.html',
	styleUrls: ['./investment-account-holding.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvestmentAccountHoldingComponent implements OnInit {
	formGroup = new FormGroup({
		assetType: new FormControl<SearchableAssetEnum>(SearchableAssetEnum.Aseet, {
			validators: [requiredValidator],
			nonNullable: true,
		}),
		symbol: new FormControl<AssetGeneralFragment | null>(null, { validators: [requiredValidator], nonNullable: true }),
		units: new FormControl<number>(0, { validators: [requiredValidator, positiveNumberValidator], nonNullable: true }),
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

	constructor(
		private investmentAccountApiService: InvestmentAccountApiService,
		private investmentAccountCalculatorService: InvestmentAccountCalculatorService,
		private dialogRef: MatDialogRef<InvestmentAccountCashChangeComponent>,
		@Inject(MAT_DIALOG_DATA) public data: { investmentId: string }
	) {}

	ngOnInit(): void {
		this.investmentAccount$ = this.investmentAccountApiService.getInvestmentAccountById(this.data.investmentId);

		// build cash categories
		this.cashCategory$ = this.investmentAccount$.pipe(
			map((account) => this.investmentAccountCalculatorService.getCashCategories(account))
		);

		this.formGroup.valueChanges.subscribe(console.log);
	}

	onSave(): void {
		this.formGroup.markAllAsTouched();
		if (this.formGroup.invalid) {
			return;
		}

		this.isSaving = true;
	}
}

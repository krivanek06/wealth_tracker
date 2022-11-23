import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map, Observable } from 'rxjs';
import { InvestmentAccountApiService } from '../../../../core/api';
import {
	InvestmentAccountCashChangeFragment,
	InvestmentAccountCashChangeType,
	InvestmentAccountFragment,
} from '../../../../core/graphql';
import { InputSource, requiredValidator } from '../../../../shared/models';

@Component({
	selector: 'app-investment-account-cash-change',
	templateUrl: './investment-account-cash-change.component.html',
	styleUrls: ['./investment-account-cash-change.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvestmentAccountCashChangeComponent implements OnInit {
	formGroup = new FormGroup({
		type: new FormControl<InvestmentAccountCashChangeType>(InvestmentAccountCashChangeType.Deposit, {
			validators: [requiredValidator],
		}),
		value: new FormControl<number | null>(null, { validators: [requiredValidator] }),
		date: new FormControl<Date>(new Date(), { validators: [requiredValidator] }),
	});

	cashTypeInputSource: InputSource[] = [
		{ caption: 'Deposit', value: InvestmentAccountCashChangeType.Deposit },
		{ caption: 'Withdrawal', value: InvestmentAccountCashChangeType.Withdrawal },
	];

	investmentAccount$!: Observable<InvestmentAccountFragment>;

	cashBalance$!: Observable<number>;

	cashCategory$!: Observable<{ [key in InvestmentAccountCashChangeType]: number }>;

	isSaving = false;

	constructor(
		private investmentAccountApiService: InvestmentAccountApiService,
		private dialogRef: MatDialogRef<InvestmentAccountCashChangeComponent>,
		@Inject(MAT_DIALOG_DATA) public data: { investmentId: string }
	) {}

	ngOnInit(): void {
		this.investmentAccount$ = this.investmentAccountApiService.getInvestmentAccountById(this.data.investmentId);

		// build cash categories
		this.cashCategory$ = this.investmentAccount$.pipe(
			map((res) =>
				res.cashChange.reduce(
					(acc, curr) => {
						return { ...acc, [curr.type]: acc[curr.type] + curr.cashValue };
					},
					{
						ASSET_OPERATION: 0,
						DEPOSIT: 0,
						WITHDRAWAL: 0,
					} as { [key in InvestmentAccountCashChangeType]: number }
				)
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

	onDelete(item: InvestmentAccountCashChangeFragment): void {
		console.log('delete', item);
	}
}

import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { catchError, EMPTY, first, map, Observable, tap } from 'rxjs';
import { InvestmentAccountApiService } from '../../../../core/api';
import {
	InvestmentAccountCashChangeFragment,
	InvestmentAccountCashChangeType,
	InvestmentAccountCashCreateInput,
	InvestmentAccountFragment,
} from '../../../../core/graphql';
import { DialogServiceUtil } from '../../../../shared/dialogs';
import { InputSource, requiredValidator } from '../../../../shared/models';
import { DateServiceUtil } from '../../../../shared/utils';
import { CashAllocation } from '../../models';
import { InvestmentAccountCalculatorService } from '../../services';

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
			nonNullable: true,
		}),
		value: new FormControl<number | null>(null, { validators: [requiredValidator] }),
		date: new FormControl<Date>(new Date(), { validators: [requiredValidator], nonNullable: true }),
	});

	cashTypeInputSource: InputSource[] = [
		{ caption: 'Deposit', value: InvestmentAccountCashChangeType.Deposit },
		{ caption: 'Withdrawal', value: InvestmentAccountCashChangeType.Withdrawal },
	];

	investmentAccount$!: Observable<InvestmentAccountFragment>;

	// display different categories and accumulated cash for them
	cashCategory$!: Observable<CashAllocation>;

	// used to show loader
	isSaving = false;

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
	}

	onSave(): void {
		this.formGroup.markAllAsTouched();
		if (this.formGroup.invalid || !this.formGroup.controls.value.value) {
			return;
		}

		this.isSaving = true;

		const input: InvestmentAccountCashCreateInput = {
			investmentAccountId: this.data.investmentId,
			cashValue: this.formGroup.controls.value.value,
			date: DateServiceUtil.formatDate(this.formGroup.controls.date.value),
			type: this.formGroup.controls.type.value,
		};

		this.investmentAccountApiService
			.createInvestmentAccountCashe(input)
			.pipe(
				tap(() => {
					this.isSaving = false;
					DialogServiceUtil.showNotificationBar(`Cash entry has been saved`);
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

	onDelete(item: InvestmentAccountCashChangeFragment): void {
		this.investmentAccountApiService
			.deleteInvestmentAccountCashe(
				{
					investmentAccountId: this.data.investmentId,
					itemId: item.itemId,
				},
				item
			)
			.pipe(
				// notify user
				tap(() => DialogServiceUtil.showNotificationBar(`Daily entry has been removed`)),
				// client error message
				catchError(() => {
					DialogServiceUtil.showNotificationBar(`Unable to perform the action`, 'error');
					return EMPTY;
				}),
				// memory leak
				first()
			)
			.subscribe();
	}
}

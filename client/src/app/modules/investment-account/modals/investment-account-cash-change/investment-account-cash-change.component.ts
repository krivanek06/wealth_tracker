import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { catchError, combineLatest, EMPTY, map, Observable, startWith, tap } from 'rxjs';
import { InvestmentAccountFacadeApiService } from '../../../../core/api';
import {
	InvestmentAccountCashChangeFragment,
	InvestmentAccountCashChangeType,
	InvestmentAccountCashCreateInput,
} from '../../../../core/graphql';
import { InvestmentAccountFragmentExtended } from '../../../../core/models';
import { DateServiceUtil } from '../../../../core/utils';
import { DialogServiceUtil } from '../../../../shared/dialogs';
import { InputSource, NONE_INPUT_SOURCE, requiredValidator } from '../../../../shared/models';
import { CashChangeTypesInputSource } from '../../models';

@Component({
	selector: 'app-investment-account-cash-change',
	templateUrl: './investment-account-cash-change.component.html',
	styleUrls: ['./investment-account-cash-change.component.scss'],
	//changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvestmentAccountCashChangeComponent implements OnInit {
	formGroup = new FormGroup({
		type: new FormControl<InvestmentAccountCashChangeType>(InvestmentAccountCashChangeType.Deposit, {
			validators: [requiredValidator],
			nonNullable: true,
		}),
		value: new FormControl<string | null>(null, { validators: [requiredValidator] }),
		date: new FormControl<Date>(new Date(), { validators: [requiredValidator], nonNullable: true }),
		filteredCashType: new FormControl<InvestmentAccountCashChangeType | null>(null),
	});

	cashTypeInputSource: InputSource[] = [
		{ caption: 'Deposit', value: InvestmentAccountCashChangeType.Deposit },
		{ caption: 'Withdrawal', value: InvestmentAccountCashChangeType.Withdrawal },
	];

	investmentAccount$!: Observable<InvestmentAccountFragmentExtended>;

	cashChange$!: Observable<InvestmentAccountCashChangeFragment[]>;

	// used to show loader
	isSaving = false;
	showCashHistory = false;

	CashChangeTypesInputSource = CashChangeTypesInputSource;
	InvestmentAccountCashChangeType = InvestmentAccountCashChangeType;

	constructor(
		private investmentAccountFacadeApiService: InvestmentAccountFacadeApiService,
		private dialogRef: MatDialogRef<InvestmentAccountCashChangeComponent>,
		@Inject(MAT_DIALOG_DATA) public data: { investmentId: string }
	) {}

	ngOnInit(): void {
		this.investmentAccount$ = this.investmentAccountFacadeApiService.getInvestmentAccountByUser();

		// displayed cash change in table
		this.cashChange$ = combineLatest([
			this.investmentAccount$,
			this.formGroup.controls.filteredCashType.valueChanges.pipe(startWith(null)),
		]).pipe(
			map(([account, filteredType]) =>
				!filteredType || filteredType === NONE_INPUT_SOURCE.value
					? account.cashChange
					: account.cashChange.filter((d) => d.type === filteredType)
			)
		);
	}

	onCashHistoryToggle(): void {
		this.showCashHistory = !this.showCashHistory;
	}

	onSave(): void {
		this.formGroup.markAllAsTouched();
		if (this.formGroup.invalid || !this.formGroup.controls.value.value) {
			return;
		}

		this.isSaving = true;

		const input: InvestmentAccountCashCreateInput = {
			cashValue: Number(this.formGroup.controls.value.value),
			date: DateServiceUtil.formatDate(this.formGroup.controls.date.value),
			type: this.formGroup.controls.type.value,
		};

		this.investmentAccountFacadeApiService
			.createInvestmentAccountCash(input)
			.pipe(
				tap(() => {
					DialogServiceUtil.showNotificationBar(`Cash entry has been saved`);
				}),
				catchError(() => {
					return EMPTY;
				})
			)
			.subscribe(() => {
				this.isSaving = false;
				this.formGroup.controls.value.patchValue(null);
			});
	}

	onDelete(item: InvestmentAccountCashChangeFragment): void {
		this.investmentAccountFacadeApiService
			.deleteInvestmentAccountCash(
				{
					itemId: item.itemId,
				},
				item
			)
			.pipe(
				// notify user
				tap(() => DialogServiceUtil.showNotificationBar(`Daily entry has been removed`)),
				// client error message
				catchError(() => {
					return EMPTY;
				})
			)
			.subscribe();
	}
}

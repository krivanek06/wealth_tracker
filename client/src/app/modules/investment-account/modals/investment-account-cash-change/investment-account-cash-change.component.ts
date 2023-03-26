import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { combineLatest, map, Observable, startWith } from 'rxjs';
import { InvestmentAccountFacadeApiService } from '../../../../core/api';
import { InvestmentAccountCashChangeFragment, InvestmentAccountCashChangeType } from '../../../../core/graphql';
import { InvestmentAccountFragmentExtended } from '../../../../core/models';
import { NONE_INPUT_SOURCE } from '../../../../shared/models';
import { CashChangeTypesInputSource } from '../../models';

@Component({
	selector: 'app-investment-account-cash-change',
	templateUrl: './investment-account-cash-change.component.html',
	styleUrls: ['./investment-account-cash-change.component.scss'],
	//changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvestmentAccountCashChangeComponent implements OnInit {
	formGroup = new FormGroup({
		filteredCashType: new FormControl<InvestmentAccountCashChangeType | null>(null),
	});

	investmentAccount$!: Observable<InvestmentAccountFragmentExtended>;

	cashChange$!: Observable<InvestmentAccountCashChangeFragment[]>;

	CashChangeTypesInputSource = CashChangeTypesInputSource;

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
}

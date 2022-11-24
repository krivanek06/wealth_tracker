import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map, Observable, startWith, switchMap } from 'rxjs';
import { InvestmentAccountApiService } from '../../../../core/api';
import {
	InvestmentAccountTransactionInputOrderType,
	InvestmentAccountTransactionOutput,
} from '../../../../core/graphql';
import { InputSource } from '../../../../shared/models';
import { GeneralFuntionUtl } from '../../../../shared/utils';
import { TransactionOrderInputSource } from '../../models';

// TODO - virtual scrolling if many transactions
// TODO - display number how many transaction has been in total executed
@Component({
	selector: 'app-investment-account-transactions',
	templateUrl: './investment-account-transactions.component.html',
	styleUrls: ['./investment-account-transactions.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvestmentAccountTransactionsComponent implements OnInit {
	/**
	 * Input source to display available symbols to filter
	 */
	symbolInputSource$!: Observable<InputSource[]>;

	transactionHistory$!: Observable<InvestmentAccountTransactionOutput[]>;

	TransactionOrderInputSource = TransactionOrderInputSource;

	formGroup = new FormGroup({
		symbols: new FormControl<string[]>([], {
			nonNullable: true,
		}),
		orderType: new FormControl<InvestmentAccountTransactionInputOrderType>(
			InvestmentAccountTransactionInputOrderType.OrderByDate,
			{
				nonNullable: true,
			}
		),
		descOrder: new FormControl<boolean>(true, {
			nonNullable: true,
		}),
		includeBuyOpeation: new FormControl<boolean>(true, {
			nonNullable: true,
		}),
	});

	constructor(
		private investmentAccountApiService: InvestmentAccountApiService,
		private dialogRef: MatDialogRef<InvestmentAccountTransactionsComponent>,
		@Inject(MAT_DIALOG_DATA) public data: { investmentId: string }
	) {}

	ngOnInit(): void {
		this.symbolInputSource$ = this.investmentAccountApiService.getTransactionSymbols(this.data.investmentId).pipe(
			map((symbols) =>
				symbols.map((d) => {
					return { caption: d, value: d, image: GeneralFuntionUtl.getAssetUrl(d) } as InputSource;
				})
			)
		);

		this.transactionHistory$ = this.formGroup.valueChanges.pipe(
			startWith(this.formGroup.value),
			switchMap((formValue) =>
				this.investmentAccountApiService.getTransactionHistory({
					accountId: this.data.investmentId,
					offset: 0,
					filterSymbols: formValue.symbols,
					orderAsc: !formValue.descOrder,
					orderType: formValue.orderType,
					includeBuyOperation: formValue.includeBuyOpeation,
				})
			)
		);
	}
}

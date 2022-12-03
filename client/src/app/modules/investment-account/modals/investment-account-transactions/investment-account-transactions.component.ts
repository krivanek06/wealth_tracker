import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map, Observable } from 'rxjs';
import { InvestmentAccountFacadeApiService } from '../../../../core/api';
import { InvestmentAccountTransactionOutput } from '../../../../core/graphql';
import { InputSource } from '../../../../shared/models';
import { GeneralFunctionUtil } from '../../../../shared/utils';
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
	});

	constructor(
		private investmentAccountFacadeApiService: InvestmentAccountFacadeApiService,
		private dialogRef: MatDialogRef<InvestmentAccountTransactionsComponent>,
		@Inject(MAT_DIALOG_DATA) public data: { investmentId: string }
	) {}

	ngOnInit(): void {
		this.symbolInputSource$ = this.investmentAccountFacadeApiService
			.getAvailableTransactionSymbols(this.data.investmentId)
			.pipe(
				map((symbols) =>
					symbols.map((d) => {
						return { caption: d, value: d, image: GeneralFunctionUtil.getAssetUrl(d) } as InputSource;
					})
				)
			);

		this.transactionHistory$ = this.investmentAccountFacadeApiService.getTransactionHistory({
			accountId: this.data.investmentId,
		});
	}
}

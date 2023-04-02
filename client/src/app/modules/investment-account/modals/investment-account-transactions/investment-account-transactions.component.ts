import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable, tap } from 'rxjs';
import { InvestmentAccountFacadeApiService } from '../../../../core/api';
import { InvestmentAccountTransactionOutput } from '../../../../core/graphql';
import { InputSource } from '../../../../shared/models';
import { InvestmentAccountCalculatorService } from '../../services';
import { DialogServiceUtil } from './../../../../shared/dialogs';

// TODO - virtual scrolling if many transactions
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

	formGroup = new FormGroup({
		symbols: new FormControl<string[]>([], {
			nonNullable: true,
		}),
	});

	constructor(
		private investmentAccountFacadeApiService: InvestmentAccountFacadeApiService,
		private investmentAccountCalculatorService: InvestmentAccountCalculatorService,
		private dialogRef: MatDialogRef<InvestmentAccountTransactionsComponent>
	) {}

	ngOnInit(): void {
		this.symbolInputSource$ = this.investmentAccountCalculatorService.getAvailableTransactionSymbolsInputSource();
		this.transactionHistory$ = this.investmentAccountFacadeApiService.getTransactionHistory();
	}

	onRemove(data: InvestmentAccountTransactionOutput): void {
		this.investmentAccountFacadeApiService
			.deleteInvestmentAccountHolding(data)
			.pipe(
				tap(() => {
					DialogServiceUtil.showNotificationBar(`Holding history has been removed`);
				})
			)
			.subscribe();
	}
}

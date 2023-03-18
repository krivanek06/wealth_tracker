import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map, Observable, tap } from 'rxjs';
import { InvestmentAccountFacadeApiService } from '../../../../core/api';
import { InvestmentAccountTransactionOutput } from '../../../../core/graphql';
import { GeneralFunctionUtil } from '../../../../core/utils';
import { InputSource } from '../../../../shared/models';
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
		private dialogRef: MatDialogRef<InvestmentAccountTransactionsComponent>,
		@Inject(MAT_DIALOG_DATA) public data: { investmentId: string }
	) {}

	ngOnInit(): void {
		this.symbolInputSource$ = this.investmentAccountFacadeApiService.getAvailableTransactionSymbols().pipe(
			map((symbols) =>
				symbols.map((d) => {
					return { caption: d, value: d, image: GeneralFunctionUtil.getAssetUrl(d) } as InputSource;
				})
			)
		);

		this.transactionHistory$ = this.investmentAccountFacadeApiService.getTransactionHistory();
	}

	onRemove(data: InvestmentAccountTransactionOutput): void {
		this.investmentAccountFacadeApiService
			.deleteInvestmentAccountHolding(this.data.investmentId, data)
			.pipe(
				tap(() => {
					DialogServiceUtil.showNotificationBar(`Holding history has been removed`);
				})
			)
			.subscribe();
	}
}

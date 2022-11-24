import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { FormMatInputWrapperModule } from '../../../../shared/components';
import { DefaultImgDirective, PerceptageIncreaseDirective } from '../../../../shared/directives';
import { InvestmentAccountTransactionsComponent } from './investment-account-transactions.component';
import { InvestmentAccountTransactionTableComponent } from './investment-account-transaction-table/investment-account-transaction-table.component';

@NgModule({
	declarations: [InvestmentAccountTransactionsComponent, InvestmentAccountTransactionTableComponent],
	imports: [
		CommonModule,
		MatDialogModule,
		MatButtonModule,
		ReactiveFormsModule,
		MatIconModule,
		FormMatInputWrapperModule,
		DefaultImgDirective,
		MatTableModule,
		PerceptageIncreaseDirective,
	],
	exports: [InvestmentAccountTransactionsComponent],
})
export class InvestmentAccountTransactionsModule {}

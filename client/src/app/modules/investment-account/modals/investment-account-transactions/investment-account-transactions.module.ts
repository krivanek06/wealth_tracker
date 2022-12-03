import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { FormMatInputWrapperModule } from '../../../../shared/components';
import {
	DefaultImgDirective,
	PerceptageIncreaseDirective,
	StylePaginatorDirective,
} from '../../../../shared/directives';
import { InvestmentAccountTransactionTableComponent } from './investment-account-transaction-table/investment-account-transaction-table.component';
import { InvestmentAccountTransactionsComponent } from './investment-account-transactions.component';

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
		MatPaginatorModule,
		StylePaginatorDirective,
		MatSortModule,
	],
	exports: [InvestmentAccountTransactionsComponent],
})
export class InvestmentAccountTransactionsModule {}

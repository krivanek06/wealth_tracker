import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ScrollWrapperModule, ValuePresentationItemModule } from '../../../../shared/components';
import {
	InvestmentAccountActiveHoldingsTableModule,
	InvestmentAccountPortfolioGrowthChartModule,
	InvestmentAccountStateModule,
} from '../../components';
import { InvestmentAccountCashChangeModule, InvestmentAccountTransactionsModule } from '../../modals';
import { InvestmentAccountComponent } from './investment-account.component';

@NgModule({
	declarations: [InvestmentAccountComponent],
	imports: [
		CommonModule,
		InvestmentAccountActiveHoldingsTableModule,
		InvestmentAccountStateModule,
		InvestmentAccountPortfolioGrowthChartModule,
		ScrollWrapperModule,
		ValuePresentationItemModule,
		ReactiveFormsModule,
		InvestmentAccountCashChangeModule,
		InvestmentAccountTransactionsModule,
	],
	exports: [InvestmentAccountComponent],
})
export class InvestmentAccountModule {}

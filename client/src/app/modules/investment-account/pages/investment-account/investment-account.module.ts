import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
	InvestmentAccountActiveHoldingsTableModule,
	InvestmentAccountPortfolioGrowthChartModule,
	InvestmentAccountStateModule,
} from '../../components';
import { InvestmentAccountComponent } from './investment-account.component';

@NgModule({
	declarations: [InvestmentAccountComponent],
	imports: [
		CommonModule,
		InvestmentAccountActiveHoldingsTableModule,
		InvestmentAccountStateModule,
		InvestmentAccountPortfolioGrowthChartModule,
	],
	exports: [InvestmentAccountComponent],
})
export class InvestmentAccountModule {}

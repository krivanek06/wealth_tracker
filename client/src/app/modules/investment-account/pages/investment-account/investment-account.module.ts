import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ScrollWrapperModule, ValuePresentationItemModule } from '../../../../shared/components';
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
		ScrollWrapperModule,
		ValuePresentationItemModule,
	],
	exports: [InvestmentAccountComponent],
})
export class InvestmentAccountModule {}

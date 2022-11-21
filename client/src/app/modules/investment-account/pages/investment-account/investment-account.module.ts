import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ScrollWrapperModule } from '../../../../shared/components';
import {
	InvestmentAccountActiveHoldingsTableModule,
	InvestmentAccountPortfolioGrowthChartModule,
	InvestmentAccountSectorAllocationModule,
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
		InvestmentAccountSectorAllocationModule,
		ScrollWrapperModule,
	],
	exports: [InvestmentAccountComponent],
})
export class InvestmentAccountModule {}

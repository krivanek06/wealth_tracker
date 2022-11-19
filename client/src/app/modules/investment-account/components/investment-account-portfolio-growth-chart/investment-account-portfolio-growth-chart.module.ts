import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HighchartsChartModule } from 'highcharts-angular';
import { InvestmentAccountPortfolioGrowthChartComponent } from './investment-account-portfolio-growth-chart.component';

@NgModule({
	declarations: [InvestmentAccountPortfolioGrowthChartComponent],
	imports: [CommonModule, HighchartsChartModule],
	exports: [InvestmentAccountPortfolioGrowthChartComponent],
})
export class InvestmentAccountPortfolioGrowthChartModule {}

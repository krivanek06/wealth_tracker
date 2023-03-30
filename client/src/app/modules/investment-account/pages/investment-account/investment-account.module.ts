import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { PieChartComponent } from '../../../../shared/components';
import { RangeDirective } from '../../../../shared/directives';
import {
	InvestmentAccountActionButtonsComponent,
	InvestmentAccountActiveHoldingsTableModule,
	InvestmentAccountPeriodChangeModule,
	InvestmentAccountStateComponent,
} from '../../components';
import { InvestmentAccountPortfolioGrowthComponent } from '../../containers';
import {
	InvestmentAccountCashChangeModule,
	InvestmentAccountHoldingModule,
	InvestmentAccountTransactionsModule,
} from '../../modals';
import { InvestmentAccountSkeletonComponent } from './investment-account-skeleton/investment-account-skeleton.component';
import { InvestmentAccountComponent } from './investment-account.component';

const routes: Routes = [
	{
		path: '',
		component: InvestmentAccountComponent,
	},
];
@NgModule({
	declarations: [InvestmentAccountComponent, InvestmentAccountSkeletonComponent],
	imports: [
		CommonModule,
		InvestmentAccountActiveHoldingsTableModule,
		InvestmentAccountStateComponent,
		ReactiveFormsModule,
		InvestmentAccountCashChangeModule,
		InvestmentAccountTransactionsModule,
		InvestmentAccountHoldingModule,
		InvestmentAccountPeriodChangeModule,
		RouterModule.forChild(routes),
		RangeDirective,
		InvestmentAccountActionButtonsComponent,
		PieChartComponent,
		InvestmentAccountPortfolioGrowthComponent,
	],
	exports: [InvestmentAccountComponent],
})
export class InvestmentAccountModule {}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule, Routes } from '@angular/router';
import { PieChartComponent } from '../../../../shared/components';
import { RangeDirective } from '../../../../shared/directives';
import {
	InvestmentAccountActionButtonsComponent,
	InvestmentAccountActiveHoldingsTableModule,
	InvestmentAccountPeriodChangeComponent,
	InvestmentAccountStateComponent,
} from '../../components';
import { InvestmentAccountPortfolioGrowthComponent } from '../../containers';
import { InvestmentAccountHoldingModule, InvestmentAccountTransactionsModule } from '../../modals';
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
		InvestmentAccountTransactionsModule,
		InvestmentAccountHoldingModule,
		InvestmentAccountPeriodChangeComponent,
		RouterModule.forChild(routes),
		RangeDirective,
		InvestmentAccountActionButtonsComponent,
		PieChartComponent,
		InvestmentAccountPortfolioGrowthComponent,
		MatButtonModule,
		MatIconModule,
	],
	exports: [InvestmentAccountComponent],
})
export class InvestmentAccountModule {}

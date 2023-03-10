import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { RangeDirective } from '../../../../shared/directives';
import {
	InvestmentAccountActionButtonsComponent,
	InvestmentAccountActiveHoldingsTableModule,
	InvestmentAccountPeriodChangeModule,
	InvestmentAccountPortfolioGrowthChartModule,
	InvestmentAccountStateComponent,
} from '../../components';
import { InvestmentAccountResolverGuard } from '../../guards';
import {
	InvestmentAccountCashChangeModule,
	InvestmentAccountHoldingModule,
	InvestmentAccountTransactionsModule,
} from '../../modals';
import { ACCOUNT_KEY } from './../../../../core/graphql/model';
import { InvestmentAccountComponent } from './investment-account.component';

const routes: Routes = [
	{
		path: '',
		component: InvestmentAccountComponent,
		resolve: { [ACCOUNT_KEY]: InvestmentAccountResolverGuard },
	},
];
@NgModule({
	declarations: [InvestmentAccountComponent],
	imports: [
		CommonModule,
		InvestmentAccountActiveHoldingsTableModule,
		InvestmentAccountStateComponent,
		InvestmentAccountPortfolioGrowthChartModule,
		ReactiveFormsModule,
		InvestmentAccountCashChangeModule,
		InvestmentAccountTransactionsModule,
		InvestmentAccountHoldingModule,
		InvestmentAccountPeriodChangeModule,
		RouterModule.forChild(routes),
		RangeDirective,
		InvestmentAccountActionButtonsComponent,
	],
	exports: [InvestmentAccountComponent],
})
export class InvestmentAccountModule {}

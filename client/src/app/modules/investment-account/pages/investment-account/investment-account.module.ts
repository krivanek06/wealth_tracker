import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ScrollWrapperModule, ValuePresentationButtonControlComponent } from '../../../../shared/components';
import {
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
		ScrollWrapperModule,
		ValuePresentationButtonControlComponent,
		ReactiveFormsModule,
		InvestmentAccountCashChangeModule,
		InvestmentAccountTransactionsModule,
		InvestmentAccountHoldingModule,
		InvestmentAccountPeriodChangeModule,
		RouterModule.forChild(routes),
	],
	exports: [InvestmentAccountComponent],
})
export class InvestmentAccountModule {}

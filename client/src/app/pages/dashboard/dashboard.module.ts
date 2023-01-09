import { LayoutModule } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterModule, Routes } from '@angular/router';
import { ResolveTokenGuard } from '../../core/guards';
import { InvestmentAccountModule } from '../../modules/investment-account/';
import { PersonalAccountModule } from '../../modules/personal-account';
import { HeaderContainerModule } from '../page-shared';
import { PersonalAccountMobileViewComponent } from './../../modules/personal-account/pages/personal-account-mobile-view/personal-account-mobile-view.component';
import { DashboardComponent } from './dashboard.component';

const routes: Routes = [
	{
		path: '',
		component: DashboardComponent,
		resolve: [ResolveTokenGuard],
	},
];

@NgModule({
	declarations: [DashboardComponent],
	imports: [
		CommonModule,
		RouterModule.forChild(routes),
		PersonalAccountModule,
		InvestmentAccountModule,
		LayoutModule,
		HeaderContainerModule,
		MatTabsModule,
		PersonalAccountMobileViewComponent,
	],
})
export class DashboardModule {}

import { LayoutModule } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule, Routes } from '@angular/router';
import { ResolveTokenGuard } from '../../core/guards';
import { InvestmentAccountModule } from '../../modules/investment-account/';
import { PersonalAccountModule } from '../../modules/personal-account';
import { HeaderContainerModule } from '../page-shared';
import { PersonalAccountMobileViewComponent } from './../../modules/personal-account/pages/personal-account-mobile-view/personal-account-mobile-view.component';
import { DashboardNavigationComponent } from './dashboard-navigation/dashboard-navigation.component';
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
		DashboardNavigationComponent,
		PersonalAccountMobileViewComponent,
		ReactiveFormsModule,
		MatDividerModule,
	],
})
export class DashboardModule {}

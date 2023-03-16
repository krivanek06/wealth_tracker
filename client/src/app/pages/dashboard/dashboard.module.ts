import { LayoutModule } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterModule, Routes } from '@angular/router';
import { AccountType } from 'src/app/core/graphql';
import { HeaderContainerModule } from '../page-shared';
import { PersonalAccountMobileViewComponent } from './../../modules/personal-account/pages/personal-account-mobile-view/personal-account-mobile-view.component';
import { DashboardComponent } from './dashboard.component';

const routes: Routes = [
	{
		path: '',
		component: DashboardComponent,
		children: [
			{
				path: `${AccountType.Personal}/:id`,
				loadChildren: () =>
					import('../../modules/personal-account/pages/personal-account/personal-account.module').then(
						(m) => m.PersonalAccountModule
					),
			},
			{
				path: `${AccountType.Investment}/:id`,
				loadChildren: () =>
					import('../../modules/investment-account/pages/investment-account/investment-account.module').then(
						(m) => m.InvestmentAccountModule
					),
			},
		],
	},
];

@NgModule({
	declarations: [DashboardComponent],
	imports: [
		CommonModule,
		RouterModule.forChild(routes),
		LayoutModule,
		HeaderContainerModule,
		PersonalAccountMobileViewComponent,
		MatDividerModule,
		MatTabsModule,
	],
})
export class DashboardModule {}

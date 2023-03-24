import { LayoutModule } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { inject, NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { Router, RouterModule, Routes } from '@angular/router';
import { map } from 'rxjs';
import { AccountManagerApiService } from '../../core/api';
import { AccountType } from '../../core/graphql';
import { DASHBOARD_ROUTES } from '../../core/models';
import { HeaderContainerModule } from '../page-shared';
import { DashboardComponent } from './dashboard.component';

const routes: Routes = [
	{
		path: '',
		component: DashboardComponent,
		children: [
			{
				path: '',
				redirectTo: DASHBOARD_ROUTES.NO_ACCOUNT,
				pathMatch: 'full',
			},
			{
				path: DASHBOARD_ROUTES.NO_ACCOUNT,
				loadChildren: () =>
					import('../../modules/manager-account/pages/account-manager/account-manager.module').then(
						(m) => m.AccountManagerModule
					),
			},
			{
				path: DASHBOARD_ROUTES.PERSONAL_ACCOUNT,
				canActivate: [
					() => {
						const service = inject(AccountManagerApiService);
						const router = inject(Router);

						// checks if personal account exists
						return service.getAvailableAccounts().pipe(
							map((accounts) => accounts.find((d) => d.accountType === AccountType.Personal)),
							map((existingAccount) => {
								if (existingAccount) {
									return true;
								}

								router.navigate([DASHBOARD_ROUTES.NO_ACCOUNT]);
								return false;
							})
						);
					},
				],
				loadChildren: () =>
					import('../../modules/personal-account/pages/personal-account/personal-account.module').then(
						(m) => m.PersonalAccountModule
					),
			},
			{
				path: DASHBOARD_ROUTES.INVESTMENT_ACCOUNT,
				canActivate: [
					() => {
						const service = inject(AccountManagerApiService);
						const router = inject(Router);

						// checks if investment account exists
						return service.getAvailableAccounts().pipe(
							map((accounts) => accounts.find((d) => d.accountType === AccountType.Investment)),
							map((existingAccount) => {
								if (existingAccount) {
									return true;
								}

								router.navigate([DASHBOARD_ROUTES.NO_ACCOUNT]);
								return false;
							})
						);
					},
				],
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
		MatDividerModule,
		MatTabsModule,
		MatButtonModule,
		MatIconModule,
	],
})
export class DashboardModule {}

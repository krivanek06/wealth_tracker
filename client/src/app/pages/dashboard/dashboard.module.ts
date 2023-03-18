import { LayoutModule } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { inject, NgModule } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
import { Router, RouterModule, Routes } from '@angular/router';
import { map } from 'rxjs';
import { InvestmentAccountFacadeApiService, PersonalAccountFacadeService } from '../../core/api';
import { DASHBOARD_ROUTES } from '../../core/models';
import { HeaderContainerModule } from '../page-shared';
import { PersonalAccountMobileViewComponent } from './../../modules/personal-account/pages/personal-account-mobile-view/personal-account-mobile-view.component';
import { DashboardComponent } from './dashboard.component';

const routes: Routes = [
	{
		path: '',
		component: DashboardComponent,
		children: [
			{
				path: DASHBOARD_ROUTES.PERSONAL_ACCOUNT,
				canActivate: [
					() => {
						const service = inject(PersonalAccountFacadeService);
						const router = inject(Router);

						return service.getPersonalAccountDetailsByUser().pipe(
							map((user) => {
								if (user) {
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
						const service = inject(InvestmentAccountFacadeApiService);
						const router = inject(Router);

						return service.getInvestmentAccountById().pipe(
							map((user) => {
								if (user) {
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
		PersonalAccountMobileViewComponent,
		MatDividerModule,
		MatTabsModule,
	],
})
export class DashboardModule {}

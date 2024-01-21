import { NgModule, inject } from '@angular/core';
import { ActivatedRouteSnapshot, PreloadAllModules, Router, RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { TOP_LEVEL_NAV } from './core/models';
import { AuthenticationAccountService } from './core/services';

const routes: Routes = [
	{
		path: '',
		component: AppComponent,
		children: [
			{
				path: '',
				redirectTo: TOP_LEVEL_NAV.dashboard,
				pathMatch: 'full',
			},
			{
				path: TOP_LEVEL_NAV.dashboard,
				canActivate: [
					(route: ActivatedRouteSnapshot) => {
						const authenticationFacadeService = inject(AuthenticationAccountService);
						const router = inject(Router);

						// save token
						if (!authenticationFacadeService.currentUser) {
							router.navigate([TOP_LEVEL_NAV.welcome]);
							return false;
						}

						return true;
					},
				],
				loadChildren: () => import('./pages/dashboard/dashboard.module').then((m) => m.DashboardModule),
			},
			{
				path: TOP_LEVEL_NAV.welcome,
				loadChildren: () => import('./pages/welcome/welcome.module').then((m) => m.WelcomeModule),
			},
			{
				path: '**',
				redirectTo: TOP_LEVEL_NAV.dashboard,
			},
		],
	},
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes, {
			scrollPositionRestoration: 'enabled',
			initialNavigation: 'enabledBlocking',
			preloadingStrategy: PreloadAllModules,
		}),
	],
	exports: [RouterModule],
})
export class AppRoutingModule {}

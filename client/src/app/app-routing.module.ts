import { NgModule, inject } from '@angular/core';
import { ActivatedRouteSnapshot, PreloadAllModules, Router, RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { TOP_LEVEL_NAV } from './core/models';
import { AuthenticationFacadeService } from './core/services';

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
						const authenticationFacadeService = inject(AuthenticationFacadeService);
						const router = inject(Router);

						// token is in local storage
						const tokenLocalStorage = authenticationFacadeService.getToken();

						// save token
						if (!tokenLocalStorage) {
							router.navigate([TOP_LEVEL_NAV.welcome]);
							return false;
						}

						authenticationFacadeService.setAccessToken(tokenLocalStorage);
						return true;
					},
				],
				loadChildren: () => import('./pages/dashboard/dashboard.module').then((m) => m.DashboardModule),
			},
			{
				path: TOP_LEVEL_NAV.welcome,
				canActivate: [
					() => {
						const authenticationFacadeService = inject(AuthenticationFacadeService);
						const router = inject(Router);

						const tokenLocalStorage = authenticationFacadeService.getToken();

						// save token - don't go to welcome page
						if (tokenLocalStorage) {
							authenticationFacadeService.setAccessToken(tokenLocalStorage);
							router.navigate([TOP_LEVEL_NAV.dashboard]);
							return false;
						}

						// go to welcome page
						return true;
					},
				],
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

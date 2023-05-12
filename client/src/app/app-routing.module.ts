import { NgModule, inject } from '@angular/core';
import { ActivatedRouteSnapshot, PreloadAllModules, Router, RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { TokenStorageService } from './core/auth';
import { TOP_LEVEL_NAV } from './core/models';
import { WelcomeModule } from './pages/welcome/welcome.module';

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
						const tokenStorageService = inject(TokenStorageService);
						const router = inject(Router);

						// token is in local storage
						const tokenLocalStorage = tokenStorageService.getTokenFromLocalStorage();

						// save token
						if (tokenLocalStorage) {
							tokenStorageService.setAccessToken(tokenLocalStorage);
							return true;
						}

						// get token from query param
						const accessToken = route.queryParams?.['accessToken'];
						console.log('client got token', accessToken);

						if (!accessToken) {
							router.navigate([TOP_LEVEL_NAV.welcome]);
							return false;
						}

						// save token
						tokenStorageService.setAccessToken({
							__typename: 'LoggedUserOutput',
							accessToken,
						});

						// Remove query params
						router.navigate([TOP_LEVEL_NAV.dashboard], {
							queryParams: {
								accessToken: null,
							},
							queryParamsHandling: 'merge',
						});

						return true;
					},
				],
				loadChildren: () => import('./pages/dashboard/dashboard.module').then((m) => m.DashboardModule),
			},
			{
				path: TOP_LEVEL_NAV.welcome,
				canActivate: [
					() => {
						const tokenStorageService = inject(TokenStorageService);
						const router = inject(Router);

						const tokenLocalStorage = tokenStorageService.getTokenFromLocalStorage();

						// save token - don't go to welcome page
						if (tokenLocalStorage) {
							console.log('welcome', tokenLocalStorage);
							tokenStorageService.setAccessToken(tokenLocalStorage);
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
		WelcomeModule,
		RouterModule.forRoot(routes, {
			initialNavigation: 'enabledBlocking',
			preloadingStrategy: PreloadAllModules,
		}),
	],
	exports: [RouterModule],
})
export class AppRoutingModule {}

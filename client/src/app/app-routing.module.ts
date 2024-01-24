import { NgModule, inject } from '@angular/core';
import { ActivatedRouteSnapshot, PreloadAllModules, Router, RouterModule, Routes } from '@angular/router';
import { map, take, tap } from 'rxjs';
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
				pathMatch: 'full',
				canActivate: [
					(route: ActivatedRouteSnapshot) => {
						const authenticationFacadeService = inject(AuthenticationAccountService);
						const router = inject(Router);

						if (authenticationFacadeService.getCurrentUser()) {
							return true;
						}

						// listen on user loaded
						return authenticationFacadeService.getLoadedAuthentication().pipe(
							tap(() => console.log('CHECK REDIRECT DASHBOARD')),
							take(1),
							map((isLoaded) => (isLoaded ? true : router.navigate([TOP_LEVEL_NAV.welcome])))
						);
					},
				],
				loadChildren: () => import('./pages/dashboard/dashboard.module').then((m) => m.DashboardModule),
			},
			{
				path: TOP_LEVEL_NAV.welcome,
				loadComponent: () => import('./pages/welcome/welcome.component').then((m) => m.WelcomeComponent),
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

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { VerifyAuthentication } from './core/guards';
import { TOP_LEVEL_NAV } from './core/models';

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
				canActivate: [VerifyAuthentication],
				loadChildren: () => import('./pages/dashboard/dashboard.module').then((m) => m.DashboardModule),
			},
			{
				path: TOP_LEVEL_NAV.welcome,
				loadChildren: () => import('./pages/welcome/welcome.module').then((m) => m.WelcomeModule),
			},
			{
				path: '**',
				redirectTo: '',
			},
		],
	},
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}

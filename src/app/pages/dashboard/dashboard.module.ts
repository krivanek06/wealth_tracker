import { LayoutModule } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterModule, Routes } from '@angular/router';
import { ThemeToggleComponent } from '../../shared/components/theme-toggle/theme-toggle.component';
import { RangeDirective } from '../../shared/directives';
import { HeaderContainerModule } from '../page-shared';
import { DashboardComponent } from './dashboard.component';

const routes: Routes = [
	{
		path: '',
		component: DashboardComponent,
		children: [
			{
				path: '',
				loadChildren: () =>
					import('../../modules/personal-account/pages/personal-account/personal-account.module').then(
						(m) => m.PersonalAccountModule
					),
				pathMatch: 'full',
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
		RangeDirective,
		ThemeToggleComponent,
	],
})
export class DashboardModule {}

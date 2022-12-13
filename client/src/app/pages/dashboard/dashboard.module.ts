import { LayoutModule } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InvestmentAccountModule } from '../../modules/investment-account/';
import { PersonalAccountModule } from '../../modules/personal-account';
import { HeaderContainerModule } from '../page-shared';
import { DashboardComponent } from './dashboard.component';

const routes: Routes = [
	{
		path: '',
		component: DashboardComponent,
		children: [],
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
	],
})
export class DashboardModule {}

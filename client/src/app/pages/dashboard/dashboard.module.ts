import { LayoutModule } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterModule, Routes } from '@angular/router';
import { InvestmentAccountModule } from '../../modules/investment-account/';
import { ManagerAccountListAccountsModule } from '../../modules/manager-account/modals';
import { PersonalAccountModule } from '../../modules/personal-account';
import { HeaderModule } from '../../shared/components';
import { DashboardComponent } from './dashboard.component';
import { HeaderContainerComponent } from './header-container/header-container.component';

const routes: Routes = [
	{
		path: '',
		component: DashboardComponent,
		children: [],
	},
];

@NgModule({
	declarations: [DashboardComponent, HeaderContainerComponent],
	imports: [
		CommonModule,
		RouterModule.forChild(routes),
		PersonalAccountModule,
		InvestmentAccountModule,
		LayoutModule,
		HeaderModule,
		ManagerAccountListAccountsModule,
		MatDialogModule,
	],
})
export class DashboardModule {}

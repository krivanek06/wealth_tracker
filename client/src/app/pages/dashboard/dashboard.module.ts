import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PersonalAccountModule } from '../../modules/personal-account';
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
	imports: [CommonModule, RouterModule.forChild(routes), PersonalAccountModule],
})
export class DashboardModule {}

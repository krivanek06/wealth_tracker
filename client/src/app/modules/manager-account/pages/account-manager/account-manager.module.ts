import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule, Routes } from '@angular/router';
import { ThemeToggleComponent } from '../../../../shared/components';
import { RangeDirective } from '../../../../shared/directives';
import { AccountManagerItemComponent } from '../../components';
import { AccountManagerSkeletonComponent } from './account-manager-skeleton/account-manager-skeleton.component';
import { AccountManagerComponent } from './account-manager.component';

const routes: Routes = [
	{
		path: '',
		component: AccountManagerComponent,
	},
];

@NgModule({
	declarations: [AccountManagerComponent, AccountManagerSkeletonComponent],
	imports: [
		CommonModule,
		MatIconModule,
		MatButtonModule,
		RouterModule.forChild(routes),
		AccountManagerItemComponent,
		RangeDirective,
		ThemeToggleComponent,
	],
})
export class AccountManagerModule {}

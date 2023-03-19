import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule, Routes } from '@angular/router';
import { AccountManagerComponent } from './account-manager.component';

const routes: Routes = [
	{
		path: '',
		component: AccountManagerComponent,
	},
];

@NgModule({
	declarations: [AccountManagerComponent],
	imports: [CommonModule, MatIconModule, MatButtonModule, RouterModule.forChild(routes)],
})
export class AccountManagerModule {}

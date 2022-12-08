import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { ManagerAccountListAccountsComponent } from './manager-account-list-accounts.component';

@NgModule({
	declarations: [ManagerAccountListAccountsComponent],
	imports: [CommonModule, MatListModule, MatButtonModule, MatIconModule, MatDialogModule],
	exports: [ManagerAccountListAccountsComponent],
})
export class ManagerAccountListAccountsModule {}

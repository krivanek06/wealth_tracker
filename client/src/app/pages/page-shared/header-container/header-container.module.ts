import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { ManagerAccountListAccountsModule } from '../../../modules/manager-account';
import { LoginModalModule } from '../../../modules/user-settings';
import { DefaultImgDirective } from '../../../shared/directives';
import { HeaderContainerComponent } from './header-container.component';
@NgModule({
	declarations: [HeaderContainerComponent],
	imports: [
		CommonModule,
		ManagerAccountListAccountsModule,
		MatDialogModule,
		LoginModalModule,
		MatButtonModule,
		MatIconModule,
		MatChipsModule,
		DefaultImgDirective,
		MatMenuModule,
	],
	exports: [HeaderContainerComponent],
})
export class HeaderContainerModule {}

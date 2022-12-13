import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { FormMatInputWrapperModule } from '../../../../shared/components';
import { FormLoginComponent } from './form-login/form-login.component';
import { FormRegisterComponent } from './form-register/form-register.component';
import { LoginModalComponent } from './login-modal.component';

@NgModule({
	declarations: [LoginModalComponent, FormRegisterComponent, FormLoginComponent],
	imports: [
		CommonModule,
		MatDialogModule,
		MatButtonModule,
		ReactiveFormsModule,
		MatIconModule,
		MatDividerModule,
		FormMatInputWrapperModule,
		MatTabsModule,
	],
	exports: [LoginModalComponent],
})
export class LoginModalModule {}

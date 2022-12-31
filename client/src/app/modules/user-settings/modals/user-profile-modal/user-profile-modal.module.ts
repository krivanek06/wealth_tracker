import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormMatInputWrapperModule } from '../../../../shared/components';
import { ChangePasswordFormComponent } from './change-password-form/change-password-form.component';
import { UserProfileInfoComponent } from './user-profile-info/user-profile-info.component';
import { UserProfileModalComponent } from './user-profile-modal.component';

@NgModule({
	declarations: [UserProfileModalComponent, UserProfileInfoComponent, ChangePasswordFormComponent],
	imports: [
		CommonModule,
		MatButtonModule,
		MatIconModule,
		MatDialogModule,
		MatDividerModule,
		ReactiveFormsModule,
		FormMatInputWrapperModule,
		MatTooltipModule,
		MatListModule,
	],
	exports: [UserProfileModalComponent],
})
export class UserProfileModalModule {}

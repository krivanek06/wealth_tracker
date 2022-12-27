import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormMatInputWrapperModule } from '../../../../shared/components';
import { UserProfileModalComponent } from './user-profile-modal.component';

@NgModule({
	declarations: [UserProfileModalComponent],
	imports: [
		CommonModule,
		MatButtonModule,
		MatIconModule,
		MatDialogModule,
		MatDividerModule,
		ReactiveFormsModule,
		FormMatInputWrapperModule,
		MatTooltipModule,
	],
	exports: [UserProfileModalComponent],
})
export class UserProfileModalModule {}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { NotificationBarConfirmDialogComponent } from './notification-bar-confirm-dialog.component';

@NgModule({
	declarations: [NotificationBarConfirmDialogComponent],
	imports: [CommonModule, MatButtonModule],
})
export class NotificationBarConfirmDialogModule {}

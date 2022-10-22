import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ConfirmDialogModule } from './confirm-dialog/confirm-dialog.module';
import { DialogServiceUtil } from './dialog-service.util';
import { NotificationBarModule } from './notification-bar/notification-bar.module';

@NgModule({
	declarations: [],
	imports: [MatSnackBarModule, MatDialogModule, NotificationBarModule, ConfirmDialogModule],
	providers: [DialogServiceUtil],
	exports: [MatSnackBarModule, MatDialogModule, NotificationBarModule, ConfirmDialogModule],
})
export class DialogServiceModule {}

import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { firstValueFrom, Observable } from 'rxjs';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { NotificationProgressComponent } from './notification-bar/notification-bar.component';

@Injectable()
export class DialogServiceUtil {
	private static snackBar: MatSnackBar;
	private static matDialog: MatDialog;

	constructor(private dialog: MatDialog, private snackBar: MatSnackBar) {
		DialogServiceUtil.matDialog = dialog;
		DialogServiceUtil.snackBar = snackBar;
	}

	static showNotificationBar(
		message: string,
		type: 'success' | 'error' | 'notification' = 'success',
		duration: number = 4000
	): void {
		if (!DialogServiceUtil.snackBar) {
			throw new Error('DialogService.snackBar not initialized');
		}

		DialogServiceUtil.snackBar.openFromComponent(NotificationProgressComponent, {
			horizontalPosition: 'end',
			verticalPosition: 'top',
			panelClass: ['g-custom-snack-bar'],
			duration,
			data: {
				message,
				type,
			},
		});
	}

	static async showConfirmDialog(
		dialogTitle: string,
		confirmButton: string = 'Confirm',
		showCancelButton: boolean = true
	): Promise<boolean> {
		if (!DialogServiceUtil.matDialog) {
			throw new Error('DialogService.matDialog not initialized');
		}

		const dialogRef = DialogServiceUtil.matDialog.open(ConfirmDialogComponent, {
			data: {
				dialogTitle,
				confirmButton,
				showCancelButton,
			},
		});

		const result = (await firstValueFrom(dialogRef.afterClosed())) as boolean;
		return result;
	}

	static showConfirmDialogObs(
		dialogTitle: string,
		confirmButton: string = 'Confirm',
		showCancelButton: boolean = true
	): Observable<boolean> {
		if (!DialogServiceUtil.matDialog) {
			throw new Error('DialogService.matDialog not initialized');
		}

		const dialogRef = DialogServiceUtil.matDialog.open(ConfirmDialogComponent, {
			data: {
				dialogTitle,
				confirmButton,
				showCancelButton,
			},
		});

		const result = dialogRef.afterClosed();
		return result;
	}
}

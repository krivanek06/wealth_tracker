import { Injectable } from '@angular/core';
import { FirebaseError } from '@angular/fire/app';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { firstValueFrom, Observable, of } from 'rxjs';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { NotificationProgressComponent } from './notification-bar/notification-bar.component';

@Injectable()
export class DialogServiceUtil {
	private static snackBar: MatSnackBar;
	private static matDialog: MatDialog;

	constructor(
		private dialog: MatDialog,
		private snackBar: MatSnackBar
	) {
		DialogServiceUtil.matDialog = dialog;
		DialogServiceUtil.snackBar = snackBar;
	}

	static handleError(error: any): void {
		console.log('error', error);
		const message = error?.message ?? '';
		const code = error?.code satisfies FirebaseError['code'];

		if (code === 'auth/email-already-in-use') {
			this.showNotificationBar('Email already in use', 'error');
			return;
		}

		if (code === 'auth/invalid-email') {
			this.showNotificationBar('Invalid email', 'error');
			return;
		}

		if (code === 'auth/weak-password') {
			this.showNotificationBar('Weak password', 'error');
			return;
		}

		if (code === 'auth/user-not-found') {
			this.showNotificationBar('Wrong email or password', 'error');
			return;
		}

		if (code === 'auth/wrong-password') {
			this.showNotificationBar('Wrong email or password', 'error');
			return;
		}

		if (code === 'auth/invalid-credential') {
			this.showNotificationBar('Invalid Email or Password', 'error');
			return;
		}

		// check if error contains the work INTERNAL
		if (message === 'INTERNAL') {
			this.showNotificationBar('Something went wrong', 'error');
			return;
		}

		// remove the word FirebaseError:
		this.showNotificationBar('Operation failed to execute', 'error');
	}

	static showNotificationBar(
		message: string,
		type: 'success' | 'error' | 'notification' = 'success',
		duration: number = 4000
	): void {
		if (!DialogServiceUtil.snackBar) {
			console.warn('DialogService.snackBar not initialized');
			return;
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
			console.warn('DialogService.matDialog not initialized');
			return false;
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
			console.warn('DialogService.matDialog not initialized');
			return of(false);
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

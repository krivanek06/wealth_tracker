import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
	selector: 'app-notification-bar-confirm-dialog',
	templateUrl: './notification-bar-confirm-dialog.component.html',
	styleUrls: ['./notification-bar-confirm-dialog.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationBarConfirmDialogComponent {
	constructor(
		private dialogRef: MatDialogRef<NotificationBarConfirmDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: { dialogTitle: string; showCancelButton: boolean; confirmButton: string }
	) {}

	confirm(): void {
		this.dialogRef.close(true);
	}

	cancel(): void {
		this.dialogRef.close(false);
	}
}

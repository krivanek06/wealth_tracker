import { Component, Inject, OnInit } from '@angular/core';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { NotificationProgressService } from './notification-bar.service';

@Component({
	selector: 'app-notification-bar',
	templateUrl: './notification-bar.component.html',
	styleUrls: ['./notification-bar.component.scss'],
	//changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationProgressComponent implements OnInit {
	value$!: Observable<number>;

	constructor(
		@Inject(MAT_SNACK_BAR_DATA) public data: { message: string; type: 'progress' | 'success' | 'error' | 'notification' },
		private snackBarRef: MatSnackBarRef<NotificationProgressComponent>,
		private notificationProgressService: NotificationProgressService
	) {}

	ngOnInit(): void {
		this.value$ = this.notificationProgressService.getCurrentValue();
	}

	closeSnackbar(): void {
		this.snackBarRef.dismiss();
	}
}

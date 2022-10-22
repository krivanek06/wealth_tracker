import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, firstValueFrom, interval, Observable } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { NotificationBarConfirmDialogComponent } from './notification-bar-confirm-dialog/notification-bar-confirm-dialog.component';
import { NotificationProgressComponent } from './notification-bar.component';
import { NotificationProgressService } from './notification-bar.service';

@Directive({
	selector: '[appNotificationProgress]',
})
export class NotificationProgressDirective {
	@Output() notificationSuccessEmitter: EventEmitter<void> = new EventEmitter<void>();

	/*
    Messages to display
  */
	@Input() notificationProgressMessage!: string;
	@Input() notificationSuccessMessage!: string;

	/*
    How many saconds before reaching 100%
  */
	@Input() notificationProgressSeconds = 1.25;

	private state$: BehaviorSubject<'start' | 'cancel'> = new BehaviorSubject<'start' | 'cancel'>('cancel');

	private cancel$: Observable<string>;

	constructor(
		private _snackBar: MatSnackBar,
		private notificationProgressService: NotificationProgressService,
		private __matDialog: MatDialog
	) {
		this.cancel$ = this.state$.pipe(filter((v) => v === 'cancel'));
	}

	@HostListener('click', ['$event.target'])
	async onClick(): Promise<void> {
		if (this.isMobileOrTablet() && (await this.openDialog(this.notificationProgressMessage))) {
			this.openSnackBar('success', this.notificationSuccessMessage, 3000);
			this.notificationSuccessEmitter.emit(); // notify parent component about task ending
		}
	}

	@HostListener('mouseup', ['$event'])
	@HostListener('mouseleave', ['$event'])
	onExit(): void {
		// once finished do not close snackbar when mouseleave
		if (this.state$.value === 'cancel') {
			return;
		}

		this.state$.next('cancel');
		this.closeSnackBar();
		this.notificationProgressService.setCurrentValue(0);
	}

	@HostListener('mousedown', ['$event'])
	onHold(event: any): void {
		// only left click is approved
		if (event.which !== 1) {
			return;
		}
		// open snackbar and init state
		this.state$.next('start');
		this.notificationProgressService.setCurrentValue(0);
		this.openSnackBar('progress', this.notificationProgressMessage);

		// add values into progress bar
		const n = 100; // miliseconds
		interval(n)
			.pipe(takeUntil(this.cancel$))
			.subscribe((v) => {
				const result = (v * n) / 10 / this.notificationProgressSeconds;
				this.notificationProgressService.setCurrentValue(result);

				// max value, close snackbar
				// max is 100, but wait 200ms to display on UI
				if (result > 120) {
					this.state$.next('cancel');
					this.notificationProgressService.setCurrentValue(0);
					this.openSnackBar('success', this.notificationSuccessMessage, 3000);
					this.notificationSuccessEmitter.emit(); // notify parent component about task ending
				}
			});
	}

	private isMobileOrTablet(): boolean {
		const toMatch = [/Android/i, /webOS/i, /iPhone/i, /iPad/i, /iPod/i, /BlackBerry/i, /Windows Phone/i];

		return toMatch.some((toMatchItem) => {
			return navigator.userAgent.match(toMatchItem);
		});
	}

	private openSnackBar(type: 'progress' | 'success', message: string, duration: number | undefined = undefined): void {
		this._snackBar.openFromComponent(NotificationProgressComponent, {
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

	private async openDialog(message: string): Promise<boolean> {
		const dialogRef = this.__matDialog.open(NotificationBarConfirmDialogComponent, {
			data: {
				dialogTitle: message,
				confirmButton: 'Confirm',
				showCancelButton: true,
			},
			panelClass: 'g-mat-dialog',
			maxWidth: '100vw',
			minWidth: '60vw',
		});

		const result = (await firstValueFrom(dialogRef.afterClosed())) as boolean;
		return result;
	}

	private closeSnackBar(): void {
		this._snackBar.dismiss();
	}
}

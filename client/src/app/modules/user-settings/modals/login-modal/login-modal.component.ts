import { Component, NgZone, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { EMPTY, catchError, filter, from, switchMap, take, tap } from 'rxjs';
import { LoginUserInput, RegisterUserInput } from '../../../../core/graphql';
import { TEST_USER_EMAIL, TEST_USER_PASSWORD, TOP_LEVEL_NAV } from '../../../../core/models';
import { AuthenticationAccountService } from '../../../../core/services';
import { DialogServiceUtil } from './../../../../shared/dialogs';

@Component({
	selector: 'app-login-modal',
	templateUrl: './login-modal.component.html',
	styleUrls: ['./login-modal.component.scss'],
	//changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginModalComponent {
	loginUserInputControl = new FormControl<LoginUserInput | null>(null);
	registerUserInputControl = new FormControl<RegisterUserInput | null>(null);
	loading = false;

	private zone = inject(NgZone);

	constructor(
		private authenticationFacadeService: AuthenticationAccountService,
		private dialogRef: MatDialogRef<LoginModalComponent>,
		private router: Router
	) {
		this.watchLoginUserFormControl();
		this.watchRegisterUserFormControl();
	}

	async onGoogleAuth() {
		from(this.authenticationFacadeService.signInGoogle())
			.pipe(
				tap(() => (this.loading = true)),
				tap(() => {
					DialogServiceUtil.showNotificationBar('Successfully login', 'success');
					// getting error: Navigation triggered outside Angular zone, did you forget to call 'ngZone.run()
					this.zone.run(() => {
						this.router.navigate([TOP_LEVEL_NAV.dashboard]);
					});
				}),
				take(1),
				catchError(() => {
					this.loading = false;
					return EMPTY;
				})
			)
			.subscribe((e) => console.log('google', e));
	}

	onDemoLogin(): void {
		this.loginUserInputControl.patchValue({
			email: TEST_USER_EMAIL,
			password: TEST_USER_PASSWORD,
		});
	}

	onCancel(): void {
		this.dialogRef.close();
	}

	private watchLoginUserFormControl(): void {
		this.loginUserInputControl.valueChanges
			.pipe(
				filter((res): res is LoginUserInput => !!res),
				tap(() => (this.loading = true)),
				switchMap((res) =>
					from(this.authenticationFacadeService.signIn(res)).pipe(
						tap(() => {
							DialogServiceUtil.showNotificationBar('Successfully login', 'success');
							// getting error: Navigation triggered outside Angular zone, did you forget to call 'ngZone.run()
							this.zone.run(() => {
								this.router.navigate([TOP_LEVEL_NAV.dashboard]);
							});
						}),
						catchError((err) => {
							DialogServiceUtil.handleError(err);
							this.loading = false;
							return EMPTY;
						})
					)
				),
				takeUntilDestroyed()
			)
			.subscribe();
	}

	private watchRegisterUserFormControl(): void {
		this.registerUserInputControl.valueChanges
			.pipe(
				filter((res): res is RegisterUserInput => !!res),
				tap(() => (this.loading = true)),
				switchMap((res) =>
					from(this.authenticationFacadeService.register(res)).pipe(
						tap(() => {
							DialogServiceUtil.showNotificationBar('User created successfully', 'success');
							// getting error: Navigation triggered outside Angular zone, did you forget to call 'ngZone.run()
							this.zone.run(() => {
								this.router.navigate([TOP_LEVEL_NAV.dashboard]);
							});
						}),
						catchError((err) => {
							DialogServiceUtil.handleError(err);
							this.loading = false;
							return EMPTY;
						})
					)
				),
				takeUntilDestroyed()
			)
			.subscribe();
	}
}

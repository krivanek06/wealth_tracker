import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { EMPTY, Subject, catchError, filter, switchMap, takeUntil, tap } from 'rxjs';
import { AuthenticationFacadeService } from '../../../../core/auth';
import { LoginForgotPasswordInput, LoginUserInput, RegisterUserInput } from '../../../../core/graphql';
import { TOP_LEVEL_NAV } from '../../../../core/models';
import { environment } from './../../../../../environments/environment';
import { DialogServiceUtil } from './../../../../shared/dialogs';

@Component({
	selector: 'app-login-modal',
	templateUrl: './login-modal.component.html',
	styleUrls: ['./login-modal.component.scss'],
	//changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginModalComponent implements OnInit, OnDestroy {
	loginUserInputControl = new FormControl<LoginUserInput | null>(null);
	registerUserInputControl = new FormControl<RegisterUserInput | null>(null);
	forgotPasswordInputControl = new FormControl<LoginForgotPasswordInput | null>(null);

	loginGoogle = `${environment.backend_url}/auth/google/login`;

	destroy$ = new Subject<void>();

	loading = false;

	constructor(
		private authenticationFacadeService: AuthenticationFacadeService,
		private dialogRef: MatDialogRef<LoginModalComponent>,
		private router: Router
	) {}

	ngOnDestroy(): void {
		this.destroy$.next();
	}

	ngOnInit(): void {
		this.watchLoginUserFormControl();
		this.watchRegisterUserFormControl();
		this.watchForgotPasswordFormControl();
	}

	toggleLoading(): void {
		this.loading = !this.loading;
	}

	private watchForgotPasswordFormControl(): void {
		this.forgotPasswordInputControl.valueChanges
			.pipe(
				filter((res): res is LoginForgotPasswordInput => !!res),
				// notify user
				tap(() => DialogServiceUtil.showNotificationBar(`Request for passport reset has been sent`, 'notification')),
				switchMap((res) =>
					this.authenticationFacadeService.resetPassword(res).pipe(
						tap((result) => {
							if (result) {
								// password was reset
								DialogServiceUtil.showNotificationBar(
									`Your password has been reset. Please check your email account`,
									'success'
								);
							} else {
								// error happened
								DialogServiceUtil.showNotificationBar(
									`Unsuccessful password reset. Please contact the support team via email`,
									'error'
								);
							}
						})
					)
				),
				takeUntil(this.destroy$)
			)
			.subscribe();
	}

	private watchLoginUserFormControl(): void {
		this.loginUserInputControl.valueChanges
			.pipe(
				filter((res): res is LoginUserInput => !!res),
				tap(() => (this.loading = true)),
				switchMap((res) =>
					this.authenticationFacadeService.loginUserBasic(res).pipe(
						tap(() => {
							DialogServiceUtil.showNotificationBar(`You have been successfully logged in`, 'success');
							this.dialogRef.close(true);
							this.router.navigate([TOP_LEVEL_NAV.dashboard]);
						}),
						catchError(() => {
							this.loading = false;
							return EMPTY;
						})
					)
				),
				takeUntil(this.destroy$)
			)
			.subscribe();
	}

	private watchRegisterUserFormControl(): void {
		this.registerUserInputControl.valueChanges
			.pipe(
				filter((res): res is RegisterUserInput => !!res),
				tap(() => (this.loading = true)),
				switchMap((res) =>
					this.authenticationFacadeService.registerBasic(res).pipe(
						tap((res) => {
							DialogServiceUtil.showNotificationBar(`Account ${res.email} has been successfully created`, 'success');
							this.dialogRef.close();
							this.router.navigate([TOP_LEVEL_NAV.dashboard]);
						}),
						catchError(() => {
							this.loading = false;
							return EMPTY;
						})
					)
				),
				takeUntil(this.destroy$)
			)
			.subscribe();
	}
}

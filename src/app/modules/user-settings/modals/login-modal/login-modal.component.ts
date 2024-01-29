import { ChangeDetectionStrategy, Component, NgZone, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FirebaseError } from '@angular/fire/app';
import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { EMPTY, catchError, filter, from, switchMap, take, tap } from 'rxjs';
import {
  LoginUserInput,
  RegisterUserInput,
  TEST_USER_EMAIL,
  TEST_USER_PASSWORD,
  TOP_LEVEL_NAV,
} from '../../../../core/models';
import { AuthenticationAccountService } from '../../../../core/services';
import { DialogServiceUtil } from '../../../../shared/dialogs';

@Component({
	selector: 'app-login-modal',
	template: `
		<app-dialog-close-header
			*ngIf="!loading()"
			(dialogCloseEmitter)="onCancel()"
			title="Login"
		></app-dialog-close-header>

		<!-- content -->
		<mat-dialog-content *ngIf="!loading(); else loader">
			<mat-tab-group>
				<mat-tab label="Login">
					<app-form-login [formControl]="loginUserInputControl"></app-form-login>

					<div class="my-4">
						<mat-divider></mat-divider>
					</div>

					<!-- social media login -->
					<h2 class="text-lg text-wt-primary-dark">Social Media Login</h2>
					<mat-dialog-actions>
						<a mat-flat-button (click)="onGoogleAuth()" color="warn" class="w-full text-center rounded-lg"> Google </a>
					</mat-dialog-actions>

					<div class="my-4">
						<mat-divider></mat-divider>
					</div>

					<!-- development -->
					<h2 class="text-lg text-wt-primary-dark">Demo Account Login</h2>
					<button mat-stroked-button color="accent" class="w-full" type="button" (click)="onDemoLogin()">
						Demo Login
					</button>
				</mat-tab>
				<mat-tab label="Register">
					<app-form-register [formControl]="registerUserInputControl"></app-form-register>
				</mat-tab>
			</mat-tab-group>
		</mat-dialog-content>

		<!-- loader -->
		<ng-template #loader>
			<div class="flex justify-center mt-[40%] sm:my-10">
				<mat-spinner color="primary" diameter="120"></mat-spinner>
			</div>
		</ng-template>
	`,
	styles: [
		`
			:host {
				display: block;
			}

			::ng-deep .mat-mdc-tab-body-wrapper {
				@apply max-sm:mt-[20px];
			}

			::ng-deep mat-dialog-container {
				@screen md {
					min-height: 670px !important;
				}
			}
		`,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginModalComponent {
	loginUserInputControl = new FormControl<LoginUserInput | null>(null);
	registerUserInputControl = new FormControl<RegisterUserInput | null>(null);
	loading = signal<boolean>(false);

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
				tap(() => this.loading.set(true)),
				tap(() => {
					DialogServiceUtil.showNotificationBar('Successfully login', 'success');
					// getting error: Navigation triggered outside Angular zone, did you forget to call 'ngZone.run()
					this.zone.run(() => {
						this.router.navigate([TOP_LEVEL_NAV.dashboard]);
						this.dialogRef.close();
					});
				}),
				take(1),
				catchError(() => {
					this.loading.set(false);
					return EMPTY;
				})
			)
			.subscribe((e) => console.log('google', e));
	}

	/**
	 * try to login with demo account or create one
	 */
	async onDemoLogin() {
		try {
			await this.authenticationFacadeService.signIn({
				email: TEST_USER_EMAIL,
				password: TEST_USER_PASSWORD,
			});
			// navigate to the app
			this.router.navigate([TOP_LEVEL_NAV.dashboard]);
			// close dialog
			this.dialogRef.close();
		} catch (err: any) {
			const code = err?.code satisfies FirebaseError['code'];
			// create account if user not found
			if (code === 'auth/user-not-found') {
				this.registerUserInputControl.patchValue({
					email: TEST_USER_EMAIL,
					password: TEST_USER_PASSWORD,
					passwordRepeat: TEST_USER_PASSWORD,
				});
			}
		}
	}

	onCancel(): void {
		this.dialogRef.close();
	}

	private watchLoginUserFormControl(): void {
		this.loginUserInputControl.valueChanges
			.pipe(
				filter((res): res is LoginUserInput => !!res),
				tap(() => this.loading.set(true)),
				switchMap((res) =>
					from(this.authenticationFacadeService.signIn(res)).pipe(
						tap(() => {
							DialogServiceUtil.showNotificationBar('Successfully login', 'success');
							// getting error: Navigation triggered outside Angular zone, did you forget to call 'ngZone.run()
							this.zone.run(() => {
								this.router.navigate([TOP_LEVEL_NAV.dashboard]);
								this.dialogRef.close();
							});
						}),
						catchError((err) => {
							DialogServiceUtil.handleError(err);
							this.loading.set(false);
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
				tap(() => this.loading.set(true)),
				switchMap((res) =>
					from(this.authenticationFacadeService.register(res)).pipe(
						tap(() => {
							DialogServiceUtil.showNotificationBar('User created successfully', 'success');
							// getting error: Navigation triggered outside Angular zone, did you forget to call 'ngZone.run()
							this.zone.run(() => {
								this.router.navigate([TOP_LEVEL_NAV.dashboard]);
								this.dialogRef.close();
							});
						}),
						catchError((err) => {
							DialogServiceUtil.handleError(err);
							this.loading.set(false);
							return EMPTY;
						})
					)
				),
				takeUntilDestroyed()
			)
			.subscribe();
	}
}

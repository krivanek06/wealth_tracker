import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { filter, switchMap, tap } from 'rxjs';
import { AuthenticationFacadeService } from '../../../../core/auth';
import { LoginUserInput, RegisterUserInput } from '../../../../core/graphql';
import { DialogServiceUtil } from './../../../../shared/dialogs/dialog-service.util';

@Component({
	selector: 'app-login-modal',
	templateUrl: './login-modal.component.html',
	styleUrls: ['./login-modal.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginModalComponent implements OnInit {
	loginUserInputControl = new FormControl<LoginUserInput | null>(null);
	registerUserInputControl = new FormControl<RegisterUserInput | null>(null);

	constructor(
		private authenticationFacadeService: AuthenticationFacadeService,
		private dialogRef: MatDialogRef<LoginModalComponent>
	) {}

	ngOnInit(): void {
		this.watchLoginUserFormControl();
		this.watchRegisterUserFormControl();
	}

	private watchLoginUserFormControl(): void {
		this.loginUserInputControl.valueChanges
			.pipe(
				filter((res): res is LoginUserInput => !!res),
				switchMap((res) =>
					this.authenticationFacadeService.loginUserBasic(res).pipe(
						tap(() => {
							DialogServiceUtil.showNotificationBar(`You have been successfully logged in`, 'success');
							this.dialogRef.close();
						})
					)
				)
			)
			.subscribe();
	}

	private watchRegisterUserFormControl(): void {
		this.registerUserInputControl.valueChanges
			.pipe(
				filter((res): res is RegisterUserInput => !!res),
				switchMap((res) =>
					this.authenticationFacadeService.registerBasic(res).pipe(
						tap((res) => {
							DialogServiceUtil.showNotificationBar(`Account ${res.email} has been successfully created`, 'success');
							this.dialogRef.close();
						})
					)
				)
			)
			.subscribe();
	}
}

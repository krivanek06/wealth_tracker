import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable, filter, switchMap, tap } from 'rxjs';
import { AuthenticationFacadeService } from '../../../../core/auth';
import { AuthenticationType, ChangePasswordInput, UserFragment } from '../../../../core/graphql';
import { DialogServiceUtil } from '../../../../shared/dialogs';

enum PROFILE_COMPONENTS {
	USER_INFO,
	CHANGE_PASSWORD,
}

@Component({
	selector: 'app-user-profile-modal',
	templateUrl: './user-profile-modal.component.html',
	styleUrls: ['./user-profile-modal.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProfileModalComponent implements OnInit {
	passwordChangeControl = new FormControl<ChangePasswordInput | null>(null);
	authenticatedUser$!: Observable<UserFragment>;

	PROFILE_COMPONENTS = PROFILE_COMPONENTS;
	AuthenticationType = AuthenticationType;
	selectedComponent: PROFILE_COMPONENTS = PROFILE_COMPONENTS.USER_INFO;

	constructor(
		private dialogRef: MatDialogRef<UserProfileModalComponent>,
		private authenticationFacadeService: AuthenticationFacadeService
	) {}

	ngOnInit(): void {
		this.authenticatedUser$ = this.authenticationFacadeService.getAuthenticatedUser();

		this.watchPasswordChange();
	}

	onComponentChange(component: PROFILE_COMPONENTS): void {
		this.selectedComponent = component;
	}

	private watchPasswordChange(): void {
		this.passwordChangeControl.valueChanges
			.pipe(
				filter((value): value is ChangePasswordInput => !!value),
				tap(() => DialogServiceUtil.showNotificationBar('Changing password', 'notification')),
				switchMap((password) =>
					this.authenticationFacadeService
						.changePassword(password)
						.pipe(tap(() => DialogServiceUtil.showNotificationBar('Your password has been changed', 'success')))
				)
			)
			.subscribe();
	}
}

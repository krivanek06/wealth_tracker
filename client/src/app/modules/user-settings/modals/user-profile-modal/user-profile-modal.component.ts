import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, filter, switchMap, tap } from 'rxjs';
import { ChangePasswordInput, UserFragment } from '../../../../core/graphql';
import { TOP_LEVEL_NAV } from '../../../../core/models';
import { AuthenticationFacadeService } from '../../../../core/services';
import { Confirmable } from '../../../../shared/decorators';
import { DialogServiceUtil } from '../../../../shared/dialogs';

enum PROFILE_COMPONENTS {
	USER_INFO,
	CHANGE_PASSWORD,
	LOADER,
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
	selectedComponent$ = new BehaviorSubject<PROFILE_COMPONENTS>(PROFILE_COMPONENTS.USER_INFO);

	constructor(
		private dialogRef: MatDialogRef<UserProfileModalComponent>,
		private authenticationFacadeService: AuthenticationFacadeService,
		private router: Router
	) {}

	ngOnInit(): void {
		this.authenticatedUser$ = this.authenticationFacadeService.getAuthenticatedUser();

		this.watchPasswordChange();
	}

	onComponentChange(component: PROFILE_COMPONENTS): void {
		this.selectedComponent$.next(component);
	}

	onCancel(): void {
		this.dialogRef.close();
	}

	@Confirmable('Please confirm removing your account')
	onRemoveAccount(): void {
		DialogServiceUtil.showNotificationBar('Account removal starting', 'notification');
		this.onComponentChange(PROFILE_COMPONENTS.LOADER);

		// init remove account
		this.authenticationFacadeService.removeAccount().subscribe(() => {
			this.authenticationFacadeService.setAccessToken(null);
			this.router.navigate([TOP_LEVEL_NAV.welcome]);
			this.dialogRef.close();

			// using timeout to hide an error message from BE, not sure why it is happening
			// TODO investigate
			setTimeout(() => {
				DialogServiceUtil.showNotificationBar('Account has been removed', 'success');
			}, 50);
		});
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

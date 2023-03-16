import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationFacadeService } from '../../../core/auth';
import { AccountIdentification, UserFragment } from '../../../core/graphql';
import { TOP_LEVEL_NAV } from '../../../core/models';
import { ManagerAccountListAccountsComponent } from '../../../modules/manager-account/modals';
import { LoginModalComponent, UserProfileModalComponent } from '../../../modules/user-settings';

@Component({
	selector: 'app-header-container',
	templateUrl: './header-container.component.html',
	styleUrls: ['./header-container.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderContainerComponent implements OnInit {
	@Input() availableAccounts?: AccountIdentification[] | null;

	authenticatedUser$!: Observable<UserFragment | null>;

	constructor(
		private authenticationFacadeService: AuthenticationFacadeService,
		private dialog: MatDialog,
		private router: Router
	) {}

	ngOnInit(): void {
		this.authenticatedUser$ = this.authenticationFacadeService.getAuthenticatedUser();

		this.authenticatedUser$.subscribe(console.log);
	}

	onUserLogout(): void {
		this.authenticationFacadeService.logoutUser();
		this.router.navigate([TOP_LEVEL_NAV.welcome]);
	}

	onAccountButtonClick(account: AccountIdentification) {
		this.router.navigate([TOP_LEVEL_NAV.dashboard, account.accountType, account.id]);
	}

	onLoginClick(): void {
		this.dialog
			.open(LoginModalComponent, {
				panelClass: ['g-mat-dialog-small'],
			})
			.afterClosed()
			.subscribe((res: boolean) => {
				if (res) {
					this.router.navigate([TOP_LEVEL_NAV.dashboard]);
				}
			});
	}

	onUserProfile(): void {
		this.dialog.open(UserProfileModalComponent, {
			panelClass: ['g-mat-dialog-medium'],
		});
	}

	onManageAccountClick(): void {
		this.dialog.open(ManagerAccountListAccountsComponent, {
			panelClass: ['g-mat-dialog-medium'],
		});
	}
}

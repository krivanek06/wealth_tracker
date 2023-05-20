import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AccountManagerApiService } from '../../../core/api';
import { AuthenticationFacadeService } from '../../../core/auth';
import { AccountIdentificationFragment, UserFragment } from '../../../core/graphql';
import { DASHBOARD_ROUTES, DASHBOARD_ROUTES_BY_TYPE, TOP_LEVEL_NAV } from '../../../core/models';
import { AboutComponent, LoginModalComponent, UserProfileModalComponent } from '../../../modules/user-settings';

@Component({
	selector: 'app-header-container',
	templateUrl: './header-container.component.html',
	styleUrls: ['./header-container.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderContainerComponent implements OnInit {
	availableAccounts$!: Observable<AccountIdentificationFragment[]>;
	authenticatedUser$!: Observable<UserFragment | null>;

	constructor(
		private authenticationFacadeService: AuthenticationFacadeService,
		private managerAccountApiService: AccountManagerApiService,
		private dialog: MatDialog,
		private router: Router
	) {}

	ngOnInit(): void {
		this.authenticatedUser$ = this.authenticationFacadeService.getAuthenticatedUser();
		this.availableAccounts$ = this.managerAccountApiService.getAvailableAccounts();
	}

	onUserLogout(): void {
		this.authenticationFacadeService.setAccessToken(null);
		this.router.navigate([TOP_LEVEL_NAV.welcome]);
	}

	onAccountButtonClick(account: AccountIdentificationFragment) {
		this.router.navigate([TOP_LEVEL_NAV.dashboard, DASHBOARD_ROUTES_BY_TYPE[account.accountType]]);
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

	onAboutProjectClick(): void {
		this.dialog.open(AboutComponent, {
			panelClass: ['g-mat-dialog-medium'],
		});
	}

	onManageAccountClick(): void {
		this.router.navigate([TOP_LEVEL_NAV.dashboard, DASHBOARD_ROUTES.ACCOUNT_MANAGER]);
	}
}

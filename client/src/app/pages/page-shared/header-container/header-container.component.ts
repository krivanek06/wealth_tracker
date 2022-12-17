import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { AuthenticationFacadeService } from '../../../core/auth';
import { UserFragment } from '../../../core/graphql';
import { ManagerAccountListAccountsComponent } from '../../../modules/manager-account/modals';
import { LoginModalComponent } from '../../../modules/user-settings';

@Component({
	selector: 'app-header-container',
	templateUrl: './header-container.component.html',
	styleUrls: ['./header-container.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderContainerComponent implements OnInit {
	authenticatedUser$!: Observable<UserFragment | null>;

	constructor(private authenticationFacadeService: AuthenticationFacadeService, private dialog: MatDialog) {}

	ngOnInit(): void {
		this.authenticatedUser$ = this.authenticationFacadeService.getAuthenticatedUser();

		this.authenticatedUser$.subscribe(console.log);
	}

	onUserLogout(): void {
		this.authenticationFacadeService.logoutUser();
	}

	onLoginClick(): void {
		this.dialog.open(LoginModalComponent, {
			panelClass: ['g-mat-dialog-small'],
		});
	}

	onManageAccountClick(): void {
		this.dialog.open(ManagerAccountListAccountsComponent, {
			panelClass: ['g-mat-dialog-medium'],
		});
	}
}

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TOP_LEVEL_NAV } from '../../../core/models';
import { AuthenticationAccountService } from '../../../core/services';
import { AboutComponent } from '../../../modules/user-settings';

@Component({
	selector: 'app-header-container',
	templateUrl: './header-container.component.html',
	styleUrls: ['./header-container.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderContainerComponent {
	constructor(
		private authenticationFacadeService: AuthenticationAccountService,
		private dialog: MatDialog,
		private router: Router
	) {}

	onUserLogout(): void {
		this.authenticationFacadeService.signOut();
		this.router.navigate([TOP_LEVEL_NAV.welcome]);
	}

	onAboutProjectClick(): void {
		this.dialog.open(AboutComponent, {
			panelClass: ['g-mat-dialog-medium'],
		});
	}
}

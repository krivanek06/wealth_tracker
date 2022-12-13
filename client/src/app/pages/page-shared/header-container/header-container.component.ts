import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ManagerAccountListAccountsComponent } from '../../../modules/manager-account/modals';
import { LoginModalComponent } from '../../../modules/user-settings';

@Component({
	selector: 'app-header-container',
	templateUrl: './header-container.component.html',
	styleUrls: ['./header-container.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderContainerComponent implements OnInit {
	constructor(private dialog: MatDialog) {}

	ngOnInit(): void {}

	onUserAccountClick(): void {
		this.dialog.open(LoginModalComponent, {
			panelClass: ['g-mat-dialog-medium'],
		});
	}

	onManageAccountClick(): void {
		this.dialog.open(ManagerAccountListAccountsComponent, {
			panelClass: ['g-mat-dialog-medium'],
		});
	}
}

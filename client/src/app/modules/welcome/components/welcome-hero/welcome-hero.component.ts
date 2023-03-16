import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TOP_LEVEL_NAV } from '../../../../core/models';
import { LoginModalComponent } from '../../../user-settings/modals';

@Component({
	selector: 'app-welcome-hero',
	standalone: true,
	imports: [CommonModule, MatButtonModule],
	templateUrl: './welcome-hero.component.html',
	styleUrls: ['./welcome-hero.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WelcomeHeroComponent {
	constructor(private dialog: MatDialog, private router: Router) {}

	onLogin() {
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
}

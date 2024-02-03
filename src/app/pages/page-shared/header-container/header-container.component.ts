import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TOP_LEVEL_NAV } from '../../../core/models';
import { AuthenticationAccountService } from '../../../core/services';
import { AboutComponent } from '../../../modules/user-settings';

@Component({
	selector: 'app-header-container',
	template: `
		<div class="flex items-center justify-end py-2 sm:justify-between md:px-4 md:mb-4">
			<!-- title -->
			<h2 class="hidden space-x-2 text-2xl lg:text-4xl sm:block">
				<span class="text-wt-primary-dark">Spend</span>
				<span class="text-white">Mindful</span>
			</h2>

			<!-- right section -->
			<div class="flex items-center gap-4 max-sm:w-full">
				<!-- theme switcher -->
				<app-theme-toggle class="hidden sm:block"></app-theme-toggle>

				<button mat-stroked-button (click)="onAboutProjectClick()" class="max-sm:w-full sm:w-[150px]">
					<mat-icon>eco</mat-icon>
					<span>About</span>
				</button>
				<button type="button" mat-stroked-button (click)="onUserLogout()" class="max-sm:w-full sm:w-[150px]">
					<mat-icon>logout</mat-icon>
					Logout
				</button>
			</div>
		</div>
	`,
	styles: [
		`
			:host {
				display: block;
			}
		`,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderContainerComponent {
	constructor(
		private authenticationFacadeService: AuthenticationAccountService,
		private dialog: MatDialog,
		private router: Router
	) {}

	onUserLogout(): void {
		this.router.navigate([TOP_LEVEL_NAV.welcome]);
		this.authenticationFacadeService.signOut();
	}

	onAboutProjectClick(): void {
		this.dialog.open(AboutComponent, {
			panelClass: ['g-mat-dialog-medium'],
		});
	}
}

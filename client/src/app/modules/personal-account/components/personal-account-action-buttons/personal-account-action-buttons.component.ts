import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';
import { Confirmable } from 'src/app/shared/decorators';
import { PersonalAccountTagManagerModalComponent, PersonalAccountTagManagerModalModule } from '../../modals';
import { PersonalAccountTestDataService } from './../../../../core/api';
import { TOP_LEVEL_NAV } from './../../../../core/models/navigation.model';
import { AuthenticationAccountService } from './../../../../core/services/authentication-account.service';
import { SCREEN_DIALOGS } from './../../../../shared/models/layout.model';
import { AboutComponent } from './../../../user-settings/modals/about/about.component';

@Component({
	selector: 'app-personal-account-action-buttons',
	standalone: true,
	imports: [
		CommonModule,
		MatIconModule,
		MatButtonModule,
		MatMenuModule,
		AboutComponent,
		PersonalAccountTagManagerModalModule,
	],
	template: `
		<div class="hidden sm:flex flex-col max-lg:justify-center gap-4">
			<button
				type="button"
				mat-stroked-button
				color="primary"
				(click)="onManageTags()"
				class="w-full max-lg:m-auto g-button-size-lg"
			>
				<mat-icon>sell</mat-icon>
				Manage Tags
			</button>

			<button
				type="button"
				mat-flat-button
				color="warn"
				(click)="onAddTestingData()"
				class="hidden xl:block max-lg:m-auto g-button-size-lg"
			>
				<mat-icon>bug_report</mat-icon>
				Add Testing Data
			</button>
		</div>

		<div class="block sm:hidden">
			<button type="button" mat-stroked-button [matMenuTriggerFor]="menu">
				<mat-icon>settings</mat-icon>
				Settings
			</button>
			<mat-menu #menu="matMenu">
				<button mat-menu-item (click)="onManageTags()" class="mb-3">
					<mat-icon>sell</mat-icon>
					Manage Tags
				</button>
				<button mat-menu-item (click)="onAboutProjectClick()" class="mb-3">
					<mat-icon>eco</mat-icon>
					<span>About</span>
				</button>
				<button mat-menu-item (click)="onUserLogout()" class="mb-3">
					<mat-icon>logout</mat-icon>
					Logout
				</button>
			</mat-menu>
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
export class PersonalAccountActionButtonsComponent {
	private personalAccountTestDataService = inject(PersonalAccountTestDataService);
	private authenticationFacadeService = inject(AuthenticationAccountService);
	private dialog = inject(MatDialog);
	private router = inject(Router);

	onManageTags(): void {
		this.dialog.open(PersonalAccountTagManagerModalComponent, {
			panelClass: [SCREEN_DIALOGS.DIALOG_BIG],
		});
	}

	onUserLogout(): void {
		this.authenticationFacadeService.signOut();
		this.router.navigate([TOP_LEVEL_NAV.welcome]);
	}

	onAboutProjectClick(): void {
		this.dialog.open(AboutComponent, {
			panelClass: [SCREEN_DIALOGS.DIALOG_MEDIUM],
		});
	}

	@Confirmable('Are you sure you want to add testing data?')
	onAddTestingData(): void {
		console.log('do it');
		this.personalAccountTestDataService.populateData();
	}
}

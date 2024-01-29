import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';
import { Confirmable } from 'src/app/shared/decorators';
import { environment } from 'src/environments/environment';
import { PersonalAccountService, PersonalAccountTestDataService } from '../../../../core/api';
import { TOP_LEVEL_NAV } from '../../../../core/models/navigation.model';
import { AuthenticationAccountService } from '../../../../core/services/authentication-account.service';
import { SCREEN_DIALOGS } from '../../../../shared/models/layout.model';
import { AboutComponent } from '../../../user-settings/modals/about/about.component';
import { PersonalAccountTagManagerModalComponent, PersonalAccountTagManagerModalModule } from '../../modals';

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
			<!-- manage tags -->
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

			<!-- remove clicked tags -->
			<button
				*ngIf="showDeselectTags"
				type="button"
				mat-stroked-button
				color="warn"
				(click)="onDeselectTags()"
				class="w-full max-lg:m-auto g-button-size-lg"
			>
				<mat-icon>disabled_by_default</mat-icon>
				Deselect Tags
			</button>

			<!-- testing data button -->
			<button
				*ngIf="displayTestingDataButton()"
				type="button"
				mat-flat-button
				color="warn"
				(click)="onAddTestingData()"
				class="hidden lg:block max-lg:m-auto g-button-size-lg"
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
	@Output() deselectTagsClickedEmitter = new EventEmitter<void>();
	@Input() showDeselectTags = false;
	private personalAccountTestDataService = inject(PersonalAccountTestDataService);
	private authenticationFacadeService = inject(AuthenticationAccountService);
	private personalAccountService = inject(PersonalAccountService);
	private dialog = inject(MatDialog);
	private router = inject(Router);

	displayTestingDataButton = computed(
		() =>
			!environment.production &&
			this.personalAccountService.personalAccountMonthlyDataSignal().every((d) => d.dailyData.length === 0)
	);

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
		this.personalAccountTestDataService.populateData();
	}

	onDeselectTags(): void {
		this.deselectTagsClickedEmitter.emit();
	}
}

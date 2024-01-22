import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { PersonalAccountActionButtonType } from '../../models';

@Component({
	selector: 'app-personal-account-action-buttons',
	standalone: true,
	imports: [CommonModule, MatIconModule, MatButtonModule, MatMenuModule],
	template: `
		<div *ngIf="displayType === 'buttons'" class="c-action-button-wrapper">
			<button
				type="button"
				mat-stroked-button
				color="primary"
				(click)="onActionButtonClick('tagManagement')"
				class="c-action-button g-button-size-lg"
			>
				<mat-icon>sell</mat-icon>
				Manage Tags
			</button>
		</div>

		<ng-container *ngIf="displayType === 'menu'">
			<button type="button" mat-stroked-button [matMenuTriggerFor]="menu">
				<mat-icon>settings</mat-icon>
				Settings
			</button>
			<mat-menu #menu="matMenu">
				<button mat-menu-item (click)="onActionButtonClick('tagManagement')">
					<mat-icon>sell</mat-icon>
					Manage Tags
				</button>
			</mat-menu>
		</ng-container>
	`,
	styles: [
		`
			:host {
				.c-action-button-wrapper {
					@apply flex flex-col max-lg:justify-center gap-4;
				}

				.c-action-button {
					@apply w-full sm:w-10/12 max-lg:m-auto;
				}
			}
		`,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonalAccountActionButtonsComponent {
	@Input() displayType: 'buttons' | 'menu' = 'buttons';

	@Output() buttonClickEmitter = new EventEmitter<PersonalAccountActionButtonType>();

	onActionButtonClick(type: PersonalAccountActionButtonType): void {
		this.buttonClickEmitter.emit(type);
	}
}

import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { PersonalAccountTag, PersonalAccountTagTypeNew } from '../../../../../core/api';

@Component({
	selector: 'app-daily-data-entry-display-elements',
	template: `
		<div class="grid gap-2">
			<!-- selected tag -->
			<div class="c-item-wrapper">
				<div
					[ngClass]="{
						'text-wt-danger-medium': tagType === 'EXPENSE',
						'text-wt-success-medium': tagType === 'INCOME'
					}"
				>
					{{ tagType === 'EXPENSE' ? 'Expense' : 'Income' }}:
				</div>
				<div class="flex items-center gap-2">
					<ng-container *ngIf="tag">
						<img appDefaultImg [src]="tag.image" imageType="tagName" class="h-7" />
						<span>{{ tag.name }}</span>
					</ng-container>
				</div>
			</div>

			<!-- selected time -->
			<div *ngIf="time" class="c-item-wrapper">
				<div>Time</div>
				<div>{{ time | date : 'h:mm a' }}</div>
			</div>
			<!-- selected date -->
			<div *ngIf="date" class="c-item-wrapper">
				<div>Date</div>
				<div>{{ date | date : 'MMM d' }}</div>
			</div>

			<!-- selected value -->
			<div *ngIf="value" class="c-item-wrapper">
				<div>Value</div>
				<div>{{ value | currency }}</div>
			</div>

			<!-- remove button -->
			<div *ngIf="isEditing" class="p-2 c-item-wrapper">
				<button mat-stroked-button color="warn" class="w-full" type="button" (click)="onRemove()">
					<mat-icon *ngIf="!isRemoving">delete</mat-icon>
					<mat-icon *ngIf="isRemoving" class="animate-spin">cached</mat-icon>
					Remove
				</button>
			</div>
		</div>
	`,
	styles: [
		`
			:host {
				display: block;

				.c-item-wrapper {
					@apply flex items-center justify-between;

					> div:first-child {
						@apply text-base flex-1;
					}
				}
			}
		`,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DailyDataEntryDisplayElementsComponent {
	@Output() removeEmitter = new EventEmitter<void>();

	@Input() isEditing = false;
	@Input() tagType: PersonalAccountTagTypeNew | null = null;
	@Input() tag: PersonalAccountTag | null = null;
	@Input() value: number | null = null;
	@Input() time: Date | null = null;
	@Input() date: Date | null = null;
	@Input() isRemoving = false;
	onRemove(): void {
		this.removeEmitter.emit();
	}
}

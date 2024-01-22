import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable, map } from 'rxjs';
import {
	PersonalAccountService,
	PersonalAccountTag,
	PersonalAccountTagCreate,
	PersonalAccountTagTypeNew,
} from '../../../../core/api';
import { Confirmable } from '../../../../shared/decorators';
import { DialogServiceUtil } from '../../../../shared/dialogs';

@Component({
	selector: 'app-personal-account-tag-manager-modal',
	template: `
		<app-dialog-close-header (dialogCloseEmitter)="onCancel()" title="Tag Manager"></app-dialog-close-header>

		<mat-dialog-content class="px-4 py-4 sm:px-8">
			<div class="flex flex-col gap-4 mb-8 sm:flex-row lg:justify-end">
				<!-- create income button -->
				<button
					class="max-lg:flex-1 g-button-size-lg"
					mat-stroked-button
					color="accent"
					type="button"
					(click)="onCreateButton('INCOME')"
					matTooltip="Create an Income tag"
				>
					<mat-icon>add</mat-icon>
					Add Income
				</button>

				<!-- create expense button -->
				<button
					class="max-lg:flex-1 g-button-size-lg"
					mat-stroked-button
					color="warn"
					type="button"
					(click)="onCreateButton('EXPENSE')"
					matTooltip="Create an Expense tag"
				>
					<mat-icon>add</mat-icon>
					Add Expense
				</button>
			</div>

			<!-- new tag -->
			<div *ngIf="creatingNewTagType">
				<h2 class="px-2 space-x-2">New Tag: <span [appTagTypeName]="creatingNewTagType"></span></h2>
				<app-tag-item
					(createTagEmitter)="onCreateTag($event)"
					[editing]="true"
					[tagType]="creatingNewTagType"
				></app-tag-item>

				<div class="my-4">
					<mat-divider></mat-divider>
				</div>
			</div>

			<!-- Income -->
			<div *ngIf="personalAccountIncomeTags$ | async as personalAccountIncomeTags">
				<h2 class="px-2"><span appTagTypeName="INCOME"></span> Tags: {{ personalAccountIncomeTags.length }}</h2>
				<app-tag-item
					class="max-lg:my-10"
					*ngFor="let tag of personalAccountIncomeTags; trackBy: tagTrackByFn"
					[tag]="tag"
					tagType="INCOME"
					(removeTagEmitter)="onRemoveTag($event)"
					(editTagEmitter)="onEditTag($event)"
				></app-tag-item>
			</div>

			<div class="my-4">
				<mat-divider></mat-divider>
			</div>

			<!-- Expense -->
			<div *ngIf="personalAccountExpenseTags$ | async as personalAccountExpenseTags">
				<!-- heading -->
				<h2 class="flex flex-col gap-2 px-2 sm:items-center sm:justify-between sm:flex-row">
					<div><span appTagTypeName="EXPENSE"></span> Tags: {{ personalAccountExpenseTags.length }}</div>
					<div class="flex items-center gap-3">
						<mat-icon
							matTooltip="Use budgeting to setup a monthly plan of spending your money for individual tags. Using budgeting you will see a
          progress bar filled based on a percentage of spent money compared to maximum allowance. If you don't want to use
          budgeting for some tags, keep it on 0."
						>
							help
						</mat-icon>
						<span class="text-wt-primary-dark">Budgeting:</span>
						<span>{{ monthlyBudget$ | async | currency }}</span>
					</div>
				</h2>

				<!-- expense items -->
				<app-tag-item
					class="max-lg:mb-10"
					*ngFor="let tag of personalAccountExpenseTags; trackBy: tagTrackByFn"
					[tag]="tag"
					tagType="EXPENSE"
					(removeTagEmitter)="onRemoveTag($event)"
					(editTagEmitter)="onEditTag($event)"
				></app-tag-item>
			</div>
		</mat-dialog-content>

		<!-- action buttons -->
		<mat-dialog-actions class="mt-3">
			<div class="g-mat-dialog-actions-end">
				<button mat-stroked-button mat-dialog-close type="button">Cancel</button>
			</div>
		</mat-dialog-actions>
	`,
	styles: `
    :host {
        display: block;
      }

      mat-dialog-content {
        @apply overflow-x-clip;
      }
  `,
	//changeDetection: ChangeDetectionStrategy.OnPush, // <- uncommented because tag images were not changing
})
export class PersonalAccountTagManagerModalComponent implements OnInit {
	personalAccountIncomeTags$!: Observable<PersonalAccountTag[]>;
	personalAccountExpenseTags$!: Observable<PersonalAccountTag[]>;
	monthlyBudget$!: Observable<number>;

	creatingNewTagType: PersonalAccountTagTypeNew | null = null;

	constructor(
		private personalAccountFacadeService: PersonalAccountService,
		private dialogRef: MatDialogRef<PersonalAccountTagManagerModalComponent>
	) {}
	ngOnInit(): void {
		this.personalAccountIncomeTags$ = this.personalAccountFacadeService
			.getPersonalAccountTags()
			.pipe(map((tags) => tags.filter((tag) => tag.type === 'INCOME')));
		this.personalAccountExpenseTags$ = this.personalAccountFacadeService
			.getPersonalAccountTags()
			.pipe(map((tags) => tags.filter((tag) => tag.type === 'EXPENSE')));

		this.monthlyBudget$ = this.personalAccountExpenseTags$.pipe(
			map((res) => res.reduce((acc, curr) => acc + (curr.budgetMonthly ?? 0), 0))
		);
	}

	tagTrackByFn(index: number, item: PersonalAccountTag): string {
		return item.id;
	}

	onCreateButton(type: PersonalAccountTagTypeNew): void {
		// remove from screen
		if (this.creatingNewTagType === type) {
			this.creatingNewTagType = null;
			return;
		}

		// display
		this.creatingNewTagType = type;
	}

	onCancel(): void {
		this.dialogRef.close();
	}

	@Confirmable('Please confirm to remove the selected tag')
	async onRemoveTag(removeTag: PersonalAccountTag): Promise<void> {
		// notify user of removing data
		DialogServiceUtil.showNotificationBar(`Removing tag ${removeTag.name}`, 'notification');

		try {
			// remove tag
			await this.personalAccountFacadeService.deletePersonalAccountTag(removeTag);

			DialogServiceUtil.showNotificationBar(`Tag ${removeTag.name} has been removed`, 'success');
		} catch (err) {
			DialogServiceUtil.handleError(err);
		}
	}

	@Confirmable('Confirm creating new tag')
	async onCreateTag(createTag: PersonalAccountTagCreate) {
		DialogServiceUtil.showNotificationBar(`Creating new tag ${createTag.name}`, 'notification');

		try {
			await this.personalAccountFacadeService.createPersonalAccountTag({
				name: createTag.name,
				color: createTag.color,
				image: createTag.image,
				budgetMonthly: createTag.budgetMonthly,
				type: createTag.type,
			});

			DialogServiceUtil.showNotificationBar('Unable to create tag', 'error');
		} catch (err) {
			DialogServiceUtil.handleError(err);
		}
	}

	async onEditTag(editTag: PersonalAccountTag) {
		DialogServiceUtil.showNotificationBar(`Editing tag ${editTag.name}`, 'notification');

		try {
			await this.personalAccountFacadeService.editPersonalAccountTag(editTag);
			DialogServiceUtil.showNotificationBar(`Tag has been changed`, 'success');
		} catch (err) {
			DialogServiceUtil.handleError(err);
		}
	}
}

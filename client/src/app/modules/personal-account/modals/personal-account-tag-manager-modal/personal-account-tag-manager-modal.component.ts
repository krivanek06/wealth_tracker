import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable, map, tap } from 'rxjs';
import { PersonalAccountFacadeService } from '../../../../core/api';
import {
	PersonalAccountTagDataCreate,
	PersonalAccountTagDataEdit,
	PersonalAccountTagFragment,
	TagDataType,
} from '../../../../core/graphql';
import { Confirmable } from '../../../../shared/decorators';
import { DialogServiceUtil } from '../../../../shared/dialogs';

@Component({
	selector: 'app-personal-account-tag-manager-modal',
	templateUrl: './personal-account-tag-manager-modal.component.html',
	styleUrls: ['./personal-account-tag-manager-modal.component.scss'],
	//changeDetection: ChangeDetectionStrategy.OnPush, // <- uncommented because tag images were not changing
})
export class PersonalAccountTagManagerModalComponent implements OnInit {
	personalAccountIncomeTags$!: Observable<PersonalAccountTagFragment[]>;
	personalAccountExpenseTags$!: Observable<PersonalAccountTagFragment[]>;
	monthlyBudget$!: Observable<number>;

	TagDataType = TagDataType;

	creatingNewTagType: TagDataType | null = null;

	constructor(
		private personalAccountFacadeService: PersonalAccountFacadeService,
		private dialogRef: MatDialogRef<PersonalAccountTagManagerModalComponent>
	) {}
	ngOnInit(): void {
		const personalAccountTags$ = this.personalAccountFacadeService
			.getPersonalAccountDetailsByUser()
			.pipe(map((res) => res.personalAccountTag));

		this.personalAccountIncomeTags$ = personalAccountTags$.pipe(
			map((tags) => tags.filter((tag) => tag.type === TagDataType.Income))
		);
		this.personalAccountExpenseTags$ = personalAccountTags$.pipe(
			map((tags) => tags.filter((tag) => tag.type === TagDataType.Expense))
		);

		this.monthlyBudget$ = this.personalAccountExpenseTags$.pipe(
			map((res) => res.reduce((acc, curr) => acc + (curr.budgetMonthly ?? 0), 0))
		);
	}

	tagTrackByFn(index: number, item: PersonalAccountTagFragment): string {
		return item.id;
	}

	onCreateButton(type: TagDataType): void {
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
	async onRemoveTag(removeTag: PersonalAccountTagFragment): Promise<void> {
		// get user account details
		const account = this.personalAccountFacadeService.personalAccountDetailsByUser;
		// find in yearly aggregation the tag that is being removed
		const tagInfo = account.yearlyAggregation.find((d) => d.tag.id === removeTag.id);

		// daily data exists, user don't want to remove it
		if (tagInfo && !(await DialogServiceUtil.showConfirmDialog(`You are about to remove ${tagInfo.entries} entries`))) {
			return;
		}

		// notify user of removing data
		DialogServiceUtil.showNotificationBar(`Removing tag ${removeTag.name}`, 'notification');

		// remove tag
		this.personalAccountFacadeService
			.deletePersonalAccountTag(removeTag)
			.pipe(
				tap((result) => {
					if (!result) {
						DialogServiceUtil.showNotificationBar('Unable to perform removing operation on tag', 'error');
						return;
					}
					DialogServiceUtil.showNotificationBar(`Tag ${removeTag.name} has been removed`, 'success');
				})
			)
			.subscribe();
	}

	@Confirmable('Confirm creating new tag')
	onCreateTag(createTag: PersonalAccountTagDataCreate): void {
		DialogServiceUtil.showNotificationBar(`Creating new tag ${createTag.name}`, 'notification');

		this.personalAccountFacadeService
			.createPersonalAccountTag({
				name: createTag.name,
				color: createTag.color,
				imageUrl: createTag.imageUrl,
				budgetMonthly: createTag.budgetMonthly,
				type: createTag.type,
			})
			.pipe(
				tap((result) => {
					if (!result) {
						DialogServiceUtil.showNotificationBar('Unable to create tag', 'error');
						return;
					}
					DialogServiceUtil.showNotificationBar(`Tag has been created`, 'success');
				})
			)
			.subscribe(() => (this.creatingNewTagType = null));
	}

	onEditTag(editTag: PersonalAccountTagDataEdit): void {
		DialogServiceUtil.showNotificationBar(`Editing tag ${editTag.name}`, 'notification');

		this.personalAccountFacadeService
			.editPersonalAccountTag({
				id: editTag.id,
				name: editTag.name,
				color: editTag.color,
				imageUrl: editTag.imageUrl,
				budgetMonthly: editTag.budgetMonthly,
			})
			.pipe(
				tap((result) => {
					if (!result) {
						DialogServiceUtil.showNotificationBar('Unable to change tag', 'error');
						return;
					}
					DialogServiceUtil.showNotificationBar(`Tag has been changed`, 'success');
				})
			)
			.subscribe();
	}
}

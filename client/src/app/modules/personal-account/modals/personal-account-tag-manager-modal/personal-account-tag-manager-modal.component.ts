import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable, map } from 'rxjs';
import { PersonalAccountFacadeService } from '../../../../core/api';
import { PersonalAccountTagFragment, TagDataType } from '../../../../core/graphql';

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

	onCreateButton(type: TagDataType): void {
		// remove from screen
		if (this.creatingNewTagType === type) {
			this.creatingNewTagType = null;
			return;
		}

		// display
		this.creatingNewTagType = type;
	}

	onNewTagRemove(): void {
		this.creatingNewTagType = null;
	}

	onCancel(): void {
		this.dialogRef.close();
	}
}

import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map, Observable } from 'rxjs';
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

	TagDataType = TagDataType;

	creatingNewTagType: TagDataType | null = null;

	constructor(
		private personalAccountFacadeService: PersonalAccountFacadeService,
		private dialogRef: MatDialogRef<PersonalAccountTagManagerModalComponent>,
		@Inject(MAT_DIALOG_DATA)
		public data: {
			personalAccountId: string;
			personalAccountName: string;
		}
	) {}
	ngOnInit(): void {
		const personalAccountTags$ = this.personalAccountFacadeService
			.getPersonalAccountDetailsById(this.data.personalAccountId)
			.pipe(map((res) => res.personalAccountTag));

		this.personalAccountIncomeTags$ = personalAccountTags$.pipe(
			map((tags) => tags.filter((tag) => tag.type === TagDataType.Income))
		);
		this.personalAccountExpenseTags$ = personalAccountTags$.pipe(
			map((tags) => tags.filter((tag) => tag.type === TagDataType.Expense))
		);
	}

	onCreateButton(type: TagDataType): void {
		this.creatingNewTagType = type;
	}

	onNewTagRemove(): void {
		this.creatingNewTagType = null;
	}
}

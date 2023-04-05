import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { catchError, EMPTY, first, Observable, of, switchMap, tap } from 'rxjs';
import { PersonalAccountFacadeService } from '../../../../core/api';
import {
	PersonalAccountDailyDataCreate,
	PersonalAccountDailyDataOutputFragment,
	PersonalAccountTagFragment,
	TagDataType,
} from '../../../../core/graphql';
import { DialogServiceUtil } from '../../../../shared/dialogs';
import {
	InputSourceWrapper,
	maxLengthValidator,
	positiveNumberValidator,
	requiredValidator,
} from '../../../../shared/models';
import { PersonalAccountDataService } from '../../services';

@Component({
	selector: 'app-personal-account-daily-data-entry',
	templateUrl: './personal-account-daily-data-entry.component.html',
	styleUrls: ['./personal-account-daily-data-entry.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonalAccountDailyDataEntryComponent implements OnInit {
	displayTagsInputSource$!: Observable<InputSourceWrapper[]>;
	selectedTag$!: Observable<PersonalAccountTagFragment>;
	TagDataType = TagDataType;

	// booleans to show spinner
	isSaving = false;
	isRemoving = false;
	showDescription = false;

	readonly formGroup = new FormGroup({
		tagId: new FormControl<string | null>(null, { validators: [requiredValidator] }),
		value: new FormControl<string | null>(null, { validators: [requiredValidator, positiveNumberValidator] }),
		time: new FormControl<Date>(new Date(), { validators: [requiredValidator] }),
		date: new FormControl<Date>(new Date(), { validators: [requiredValidator] }),
		description: new FormControl<string | null>(null, { validators: [maxLengthValidator(80)] }),
	});

	constructor(
		private personalAccountFacadeService: PersonalAccountFacadeService,
		private personalAccountDataService: PersonalAccountDataService,
		private dialogRef: MatDialogRef<PersonalAccountDailyDataEntryComponent>,
		@Inject(MAT_DIALOG_DATA)
		public data: {
			dailyData: PersonalAccountDailyDataOutputFragment | null;
		}
	) {}

	ngOnInit(): void {
		// editing
		if (this.data.dailyData) {
			this.initEditing(this.data.dailyData);
		}

		this.displayTagsInputSource$ = this.personalAccountDataService.getAvailableTagInputSourceWrapper();
	}

	onDescriptionToggle(): void {
		this.showDescription = !this.showDescription;
	}

	onRemove(): void {
		if (!this.data.dailyData) {
			throw new Error('PersonalAccountDailyDataEntryComponent, removing unexisting item');
		}
		this.isRemoving = true;
		DialogServiceUtil.showNotificationBar(`Operation sent to the server side`, 'notification');

		this.personalAccountFacadeService
			.deletePersonalAccountDailyEntry({
				dailyDataId: this.data.dailyData.id,
				monthlyDataId: this.data.dailyData.monthlyDataId,
			})
			.pipe(
				// notify user
				tap(() => DialogServiceUtil.showNotificationBar(`Daily entry has been removed`)),
				// close dialog
				tap(() => this.dialogRef.close()),
				// client error message
				catchError(() => {
					this.isSaving = false;
					return EMPTY;
				}),
				// memory leak
				first()
			)
			.subscribe();
	}

	onSave(): void {
		this.formGroup.markAllAsTouched();
		const dailyDataCreate = this.getDailyDatafromForm();

		if (this.formGroup.invalid || !dailyDataCreate) {
			return;
		}

		this.isSaving = true;

		// decide if creating or editing
		const editedDailyData = this.data.dailyData;
		of(editedDailyData)
			.pipe(
				tap(() => DialogServiceUtil.showNotificationBar(`Operation sent to the server side`, 'notification')),
				switchMap(() =>
					!editedDailyData
						? this.personalAccountFacadeService.createPersonalAccountDailyEntry(dailyDataCreate)
						: this.personalAccountFacadeService.editPersonalAccountDailyEntry({
								dailyDataCreate,
								dailyDataDelete: {
									dailyDataId: editedDailyData.id,
									monthlyDataId: editedDailyData.monthlyDataId,
								},
						  })
				),
				// notify user
				tap(() => DialogServiceUtil.showNotificationBar(`Daily entry has been saved`)),
				// close dialog
				tap(() => this.dialogRef.close()),
				// client error message
				catchError(() => {
					this.isSaving = false;
					return EMPTY;
				}),
				// memory leak
				first()
			)
			.subscribe();
	}

	private initEditing(dailyData: PersonalAccountDailyDataOutputFragment): void {
		this.formGroup.setValue({
			date: new Date(Number(dailyData.date)),
			time: new Date(Number(dailyData.date)),
			tagId: dailyData.tagId,
			value: String(dailyData.value),
			description: dailyData.description || '',
		});
	}

	private getDailyDatafromForm(): PersonalAccountDailyDataCreate | null {
		// get values from form
		const dateValue = this.formGroup.controls.date.value;
		const timeValue = this.formGroup.controls.time.value;
		const tagValue = this.formGroup.controls.tagId.value;
		const description = this.formGroup.controls.description.value;
		const valueValue = this.formGroup.controls.value.value;

		// TS checking, should not happen
		if (!dateValue || !timeValue || !tagValue || !valueValue) {
			return null;
		}

		// combine dateValue & timeValue into one date
		const combinedDate = new Date(
			dateValue.getFullYear(),
			dateValue.getMonth(),
			dateValue.getDate(),
			timeValue.getHours(),
			timeValue.getMinutes(),
			timeValue.getSeconds()
		);

		// create server obj
		const dailyEntry: PersonalAccountDailyDataCreate = {
			date: combinedDate.toString(),
			value: Number(valueValue),
			tagId: tagValue,
			description: description ?? '',
		};

		return dailyEntry;
	}
}

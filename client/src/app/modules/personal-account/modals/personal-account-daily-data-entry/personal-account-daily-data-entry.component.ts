import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { iif, map, Observable, startWith, switchMap, tap } from 'rxjs';
import { InputSource } from '../../../../shared/models';
import { getTagImageLocation } from '../../models';
import { PersonalAccountApiService } from './../../../../core/api';
import {
	PersonalAccountDailyDataCreate,
	PersonalAccountDailyDataFragment,
	PersonalAccountTagFragment,
	TagDataType,
} from './../../../../core/graphql';
import { positiveNumberValidator, requiredValidator } from './../../../../shared/models';

@Component({
	selector: 'app-personal-account-daily-data-entry',
	templateUrl: './personal-account-daily-data-entry.component.html',
	styleUrls: ['./personal-account-daily-data-entry.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonalAccountDailyDataEntryComponent implements OnInit {
	displayTagsInputSource$!: Observable<InputSource[]>;
	TagDataType = TagDataType;

	readonly formGroup = new FormGroup({
		tagType: new FormControl<TagDataType>(TagDataType.Expense, { validators: [requiredValidator] }),
		tag: new FormControl<PersonalAccountTagFragment | null>(null, { validators: [requiredValidator] }),
		value: new FormControl<number | null>(null, { validators: [requiredValidator, positiveNumberValidator] }),
		time: new FormControl<Date>(new Date(), { validators: [requiredValidator] }),
		date: new FormControl<Date>(new Date(), { validators: [requiredValidator] }),
	});

	constructor(
		private personalAccountApiService: PersonalAccountApiService,
		private dialogRef: MatDialogRef<PersonalAccountDailyDataEntryComponent>,
		@Inject(MAT_DIALOG_DATA)
		public data: {
			personalAccountId: string;
			personalAccountName: string;
			dailyData: PersonalAccountDailyDataFragment | null;
		}
	) {}

	ngOnInit(): void {
		this.formGroup.valueChanges.subscribe(console.log);
		this.initIncomeExpenseTags();

		if (this.data.dailyData) {
			// todo implement editing
		}
	}

	onSave(): void {
		this.formGroup.markAllAsTouched();
		if (this.formGroup.invalid) {
			return;
		}

		// get values from form
		const dateValue = this.formGroup.controls.date.value;
		const timeValue = this.formGroup.controls.time.value;
		const tagValue = this.formGroup.controls.tag.value;
		const valueValue = this.formGroup.controls.value.value;

		// TS checking, should not happen
		if (!dateValue || !timeValue || !tagValue || !valueValue) {
			return;
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
			value: valueValue,
			tagId: tagValue.id,
			personalAccountId: this.data.personalAccountId,
		};

		this.dialogRef.close(dailyEntry);
	}

	private initIncomeExpenseTags(): void {
		// filter expense tags
		const displayTagsExponse$ = this.personalAccountApiService.getDefaultTagsExpense().pipe(
			map((tags) =>
				tags.map((d) => {
					return { caption: d.name, value: d, image: getTagImageLocation(d.name) } as InputSource;
				})
			)
		);

		// filter income tags
		const displayTagsIncome$ = this.personalAccountApiService.getDefaultTagsIncome().pipe(
			map((tags) =>
				tags.map((d) => {
					return { caption: d.name, value: d, image: getTagImageLocation(d.name) } as InputSource;
				})
			)
		);

		// based on tagType switch which one to display
		this.displayTagsInputSource$ = this.formGroup.controls.tagType.valueChanges.pipe(
			startWith(this.formGroup.controls.tagType.value),
			// reset selected tag
			tap(() => this.formGroup.controls.tag.patchValue(null, { emitEvent: false })),
			// decide which tag types to display
			switchMap((tagType) => iif(() => tagType === TagDataType.Expense, displayTagsExponse$, displayTagsIncome$))
		);
	}
}

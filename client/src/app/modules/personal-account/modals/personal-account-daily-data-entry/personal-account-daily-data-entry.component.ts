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
	selectedTag$!: Observable<PersonalAccountTagFragment>;
	TagDataType = TagDataType;

	readonly formGroup = new FormGroup({
		tagType: new FormControl<TagDataType>(TagDataType.Expense, { validators: [requiredValidator] }),
		tagId: new FormControl<string | null>(null, { validators: [requiredValidator] }),
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
		if (this.data.dailyData) {
			this.formGroup.setValue({
				date: new Date(Number(this.data.dailyData.date)),
				time: new Date(Number(this.data.dailyData.date)),
				tagId: this.data.dailyData.tag.id,
				tagType: this.data.dailyData.tag.type,
				value: this.data.dailyData.value,
			});
		}

		this.displayTagsInputSource$ = this.initIncomeExpenseTags();
		this.selectedTag$ = this.initSelectedTag();
		this.clearTagOnTagTypeChange();
	}

	onSave(): void {
		this.formGroup.markAllAsTouched();
		if (this.formGroup.invalid) {
			return;
		}

		// get values from form
		const dateValue = this.formGroup.controls.date.value;
		const timeValue = this.formGroup.controls.time.value;
		const tagValue = this.formGroup.controls.tagId.value;
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
			tagId: tagValue,
			personalAccountId: this.data.personalAccountId,
		};

		this.dialogRef.close(dailyEntry);
	}

	private initSelectedTag(): Observable<PersonalAccountTagFragment> {
		return this.formGroup.controls.tagId.valueChanges.pipe(
			startWith(this.formGroup.controls.tagId.value),
			switchMap((value) =>
				this.displayTagsInputSource$.pipe(
					map((source) => source.find((d) => d.value === value)?.additionalData as PersonalAccountTagFragment)
				)
			)
		);
	}

	private clearTagOnTagTypeChange(): void {
		this.formGroup.controls.tagType.valueChanges
			.pipe(
				// reset selected tag
				tap(() => this.formGroup.controls.tagId.patchValue(null, { emitEvent: false }))
			)
			.subscribe();
	}

	private initIncomeExpenseTags(): Observable<InputSource[]> {
		// filter expense tags
		const displayTagsExponse$ = this.personalAccountApiService.getDefaultTagsExpense().pipe(
			map((tags) =>
				tags.map((d) => {
					return { caption: d.name, value: d.id, additionalData: d, image: getTagImageLocation(d.name) } as InputSource;
				})
			)
		);

		// filter income tags
		const displayTagsIncome$ = this.personalAccountApiService.getDefaultTagsIncome().pipe(
			map((tags) =>
				tags.map((d) => {
					return { caption: d.name, value: d.id, additionalData: d, image: getTagImageLocation(d.name) } as InputSource;
				})
			)
		);

		// based on tagType switch which one to display
		return this.formGroup.controls.tagType.valueChanges.pipe(
			startWith(this.formGroup.controls.tagType.value),
			// decide which tag types to display
			switchMap((tagType) => iif(() => tagType === TagDataType.Expense, displayTagsExponse$, displayTagsIncome$))
		);
	}
}

import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { iif, map, Observable, startWith, switchMap } from 'rxjs';
import { DisplayTagFormField } from '../../models';
import { PersonalAccountApiService } from './../../../../core/api';
import { PersonalAccountDailyDataFragment, PersonalAccountTagFragment, TagDataType } from './../../../../core/graphql';

@Component({
	selector: 'app-personal-account-daily-data-entry',
	templateUrl: './personal-account-daily-data-entry.component.html',
	styleUrls: ['./personal-account-daily-data-entry.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonalAccountDailyDataEntryComponent implements OnInit {
	// input value for tag select component
	displayTags$!: Observable<DisplayTagFormField[]>;

	TagDataType = TagDataType;

	readonly formGroup = new FormGroup({
		tagType: new FormControl<TagDataType>(TagDataType.Expense, { validators: [Validators.required] }),
		tag: new FormControl<PersonalAccountTagFragment[] | null>(null, { validators: [Validators.required] }),
		value: new FormControl<number | null>(null, { validators: [Validators.required, Validators.min(0)] }),
		time: new FormControl<Date | null>(new Date(), { validators: [Validators.required] }),
		date: new FormControl<Date | null>(new Date(), { validators: [Validators.required] }),
	});

	constructor(
		private personalAccountApiService: PersonalAccountApiService,
		private dialogRef: MatDialogRef<PersonalAccountDailyDataEntryComponent>,
		@Inject(MAT_DIALOG_DATA) public data: { dailyData: PersonalAccountDailyDataFragment | null }
	) {}

	ngOnInit(): void {
		this.formGroup.valueChanges.subscribe(console.log);
		this.initIncomeExpenseTags();

		if (this.data.dailyData) {
			// todo implement editing
		}
	}

	onCancel(): void {
		this.dialogRef.close();
	}

	onSave(): void {
		this.formGroup.markAllAsTouched();
		console.log(this.formGroup.getRawValue());
	}

	private initIncomeExpenseTags(): void {
		// filter expense tags
		const displayTagsExponse$ = this.personalAccountApiService.getDefaultTagsExpense().pipe(
			map((tags) =>
				tags.map((d) => {
					return { tag: d } as DisplayTagFormField;
				})
			)
		);

		// filter income tags
		const displayTagsIncome$ = this.personalAccountApiService.getDefaultTagsIncome().pipe(
			map((tags) =>
				tags.map((d) => {
					return { tag: d } as DisplayTagFormField;
				})
			)
		);

		// based on tagType switch which one to display
		this.displayTags$ = this.formGroup.controls.tagType.valueChanges.pipe(
			startWith(this.formGroup.controls.tagType.value),
			switchMap((tagType) => iif(() => tagType === TagDataType.Expense, displayTagsExponse$, displayTagsIncome$))
		);
	}
}

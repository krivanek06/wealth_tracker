import { ChangeDetectionStrategy, Component, inject, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PersonalAccountDailyDataFragment } from './../../../../core/graphql';

@Component({
	selector: 'app-personal-account-daily-data-entry',
	templateUrl: './personal-account-daily-data-entry.component.html',
	styleUrls: ['./personal-account-daily-data-entry.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonalAccountDailyDataEntryComponent implements OnInit {
	private fb = inject(FormBuilder);

	readonly formGroup = this.fb.group({
		tag: [null, [Validators.required]],
		value: [0, [Validators.required, Validators.min(0)]],
		date: [null, [Validators.required]],
	});

	constructor(
		private dialogRef: MatDialogRef<PersonalAccountDailyDataEntryComponent>,
		@Inject(MAT_DIALOG_DATA) public data: { dailyData: PersonalAccountDailyDataFragment }
	) {}

	ngOnInit(): void {}

	onCancel(): void {
		this.dialogRef.close();
	}

	onSave(): void {
		this.formGroup.markAllAsTouched();
		console.log(this.formGroup.getRawValue());
	}
}

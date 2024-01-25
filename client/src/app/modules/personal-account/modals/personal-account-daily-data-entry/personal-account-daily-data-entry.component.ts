import { ChangeDetectionStrategy, Component, Inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { format } from 'date-fns';
import {
	PersonalAccountDailyDataCreateNew,
	PersonalAccountDailyDataNew,
	PersonalAccountService,
} from '../../../../core/api';
import { Confirmable } from '../../../../shared/decorators';
import { DialogServiceUtil } from '../../../../shared/dialogs';
import { positiveNumberValidator, requiredValidator } from '../../../../shared/models';
import { PersonalAccountDataService } from '../../services';

@Component({
	selector: 'app-personal-account-daily-data-entry',
	template: `
		<app-dialog-close-header (dialogCloseEmitter)="onCancel()" title="Daily Data"></app-dialog-close-header>

		<div *ngIf="showLoader(); else showForm" class="mt-6 mb-10">
			<mat-spinner diameter="100" class="m-auto"></mat-spinner>
		</div>

		<ng-template #showForm>
			<form (ngSubmit)="onSave()" [formGroup]="formGroup" class="-mt-3">
				<mat-dialog-content class="flex flex-col gap-x-4">
					<!-- date picker -->
					<app-date-picker class="max-sm:-mt-3" formControlName="date"></app-date-picker>

					<!-- tag -->
					<app-form-mat-input-wrapper
						formControlName="tagId"
						inputCaption="Select tag"
						inputType="SELECT_SOURCE_WRAPPER"
						[inputSourceWrapper]="displayTagsInputSource()"
					></app-form-mat-input-wrapper>

					<!-- display value -->
					<div class="flex items-center justify-between w-full pl-4 mb-6 mt-4 text-xl">
						<span class="text-wt-gray-light">$</span>

						<div class="flex items-center gap-4">
							<span class="text-white">{{ formGroup.controls.value.value ?? 0 }}</span>
							<div *ngIf="data.dailyData" matTooltip="Remove item">
								<button type="button" mat-icon-button color="warn" (click)="onRemove()">
									<mat-icon>delete</mat-icon>
								</button>
							</div>
						</div>
					</div>

					<div>
						<app-number-keyboard-control formControlName="value"></app-number-keyboard-control>
					</div>
				</mat-dialog-content>

				<div class="hidden my-4 sm:block">
					<mat-divider></mat-divider>
				</div>

				<!-- action buttons -->
				<mat-dialog-actions class="max-sm:mt-2 pl-5">
					<div class="g-mat-dialog-actions-full">
						<button mat-stroked-button mat-dialog-close type="button">Cancel</button>
						<button mat-stroked-button color="primary" type="submit" [disabled]="!formGroup.controls.value.value">
							Save
						</button>
					</div>
				</mat-dialog-actions>
			</form>
		</ng-template>
	`,
	styles: [
		`
			:host {
				display: block;
			}
		`,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonalAccountDailyDataEntryComponent implements OnInit {
	displayTagsInputSource = this.personalAccountDataService.availableTagInputSourceWrapper;

	// booleans to show spinner
	showLoader = signal(false);

	readonly formGroup = new FormGroup({
		tagId: new FormControl<string | null>(null, { validators: [requiredValidator] }),
		value: new FormControl<string | null>(null, { validators: [requiredValidator, positiveNumberValidator] }),
		date: new FormControl<Date>(new Date(), { validators: [requiredValidator] }),
	});

	constructor(
		private personalAccountFacadeService: PersonalAccountService,
		private personalAccountDataService: PersonalAccountDataService,
		private dialogRef: MatDialogRef<PersonalAccountDailyDataEntryComponent>,
		@Inject(MAT_DIALOG_DATA)
		public data: {
			dailyData: PersonalAccountDailyDataNew | null;
		}
	) {}

	ngOnInit(): void {
		// editing
		if (this.data.dailyData) {
			this.initEditing(this.data.dailyData);
		}
	}

	onCancel(): void {
		this.dialogRef.close();
	}

	@Confirmable('Confirm removing item')
	onRemove(): void {
		if (!this.data.dailyData) {
			throw new Error('PersonalAccountDailyDataEntryComponent, removing nonexisting item');
		}

		DialogServiceUtil.showNotificationBar(`Operation sent to the server side`, 'notification');
		this.showLoader.set(true);

		try {
			this.personalAccountFacadeService.deletePersonalAccountDailyEntry(this.data.dailyData);
			DialogServiceUtil.showNotificationBar(`Daily entry has been removed`);
		} catch (e) {
			DialogServiceUtil.handleError(e);
		} finally {
			this.showLoader.set(false);
		}
	}

	async onSave() {
		this.formGroup.markAllAsTouched();
		const dailyDataCreate = this.getDailyDatafromForm();

		if (this.formGroup.invalid || !dailyDataCreate) {
			return;
		}

		this.showLoader.set(true);

		// decide if creating or editing
		const editedDailyData = this.data.dailyData;

		try {
			if (editedDailyData) {
				await this.personalAccountFacadeService.editPersonalAccountDailyEntry(editedDailyData, dailyDataCreate);
			} else {
				await this.personalAccountFacadeService.createPersonalAccountDailyEntry(dailyDataCreate);
			}
			this.dialogRef.close();
		} catch (e) {
			DialogServiceUtil.handleError(e);
		} finally {
			this.showLoader.set(false);
		}
	}

	private initEditing(dailyData: PersonalAccountDailyDataNew): void {
		this.formGroup.setValue({
			date: new Date(dailyData.date),
			tagId: dailyData.tagId,
			value: String(dailyData.value),
		});
	}

	private getDailyDatafromForm(): PersonalAccountDailyDataCreateNew | null {
		// get values from form
		const dateValue = this.formGroup.controls.date.value;
		const tagValue = this.formGroup.controls.tagId.value;
		const valueValue = this.formGroup.controls.value.value;

		// TS checking, should not happen
		if (!dateValue || !tagValue || !valueValue) {
			return null;
		}

		// create server obj
		const dailyEntry: PersonalAccountDailyDataCreateNew = {
			date: format(dateValue, 'yyyy-MM-dd'),
			value: Number(valueValue),
			tagId: tagValue,
		};

		return dailyEntry;
	}
}

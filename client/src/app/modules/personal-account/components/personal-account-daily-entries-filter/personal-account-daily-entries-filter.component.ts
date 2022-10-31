import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, FormBuilder } from '@angular/forms';
import { ModelFormGroup } from '../../../../shared/models';
import { DailyEntriesFiler } from '../../models';

@Component({
	selector: 'app-personal-account-daily-entries-filter',
	templateUrl: './personal-account-daily-entries-filter.component.html',
	styleUrls: ['./personal-account-daily-entries-filter.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonalAccountDailyEntriesFilterComponent implements OnInit, ControlValueAccessor {
	@Input() weeklyIds!: string[]; // 2022-7-32, 2022-7-33, ...
	@Input() monthlyDataId!: string; // selected: 2022-7-32

	yearsAndMonths!: string[];

	private fb = inject(FormBuilder);

	readonly formGroup: ModelFormGroup<DailyEntriesFiler> = this.fb.nonNullable.group({
		yearAndMonth: [''],
		week: [-1],
		day: [-1],
		tag: [''],
	});

	onChange: (dateRange?: DailyEntriesFiler) => void = () => {
		/** empty */
	};
	// onTouched callback that will be overridden using `registerOnTouched`
	onTouched = () => {
		/** empty */
	};
	constructor() {}

	ngOnInit(): void {
		this.yearsAndMonths = [
			...new Set(
				this.weeklyIds.map((d) => {
					const [year, month] = d.split('-');
					return `${year}-${month}`;
				})
			),
		];
	}

	writeValue(obj: any): void {
		// throw new Error('Method not implemented.');
	}
	/**
	 * Register Component's ControlValueAccessor onChange callback
	 */
	registerOnChange(fn: PersonalAccountDailyEntriesFilterComponent['onChange']): void {
		this.onChange = fn;
	}

	/**
	 * Register Component's ControlValueAccessor onTouched callback
	 */
	registerOnTouched(fn: PersonalAccountDailyEntriesFilterComponent['onTouched']): void {
		this.onTouched = fn;
	}
}

import { ChangeDetectionStrategy, Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { PersonalAccountFilterFormValues } from '../../models';
import { DateServiceUtil } from './../../../../shared/utils';

@Component({
	selector: 'app-personal-account-daily-entries-filter',
	templateUrl: './personal-account-daily-entries-filter.component.html',
	styleUrls: ['./personal-account-daily-entries-filter.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => PersonalAccountDailyEntriesFilterComponent),
			multi: true,
		},
	],
})
export class PersonalAccountDailyEntriesFilterComponent implements OnInit, ControlValueAccessor {
	// 2022-7-32, 2022-7-33,
	@Input() set weeklyIds(ids: string[] | null | undefined) {
		this.displayYearsAndMonths = [
			...new Set(
				(ids ?? []).map((d) => {
					const [year, month] = d.split('-');
					return `${year}-${month}`;
				})
			),
		];
	}

	/**
	 * property to store `${year}-${month}` format from yearsAndMonths
	 */
	displayYearsAndMonths!: string[];

	readonly formGroup = new FormGroup({
		yearAndMonth: new FormControl<string>('', { nonNullable: true }),
		week: new FormControl<number>(-1, { nonNullable: true }),
	});

	onChange: (filterState?: PersonalAccountFilterFormValues) => void = () => {};
	onTouched = () => {};

	constructor() {}

	ngOnInit(): void {
		this.formGroup.controls.yearAndMonth.valueChanges.subscribe(() => {
			// on month change reset weeks and tags
			this.formGroup.controls.week.reset(-1, { emitEvent: false, onlySelf: true });
			this.notifyParent();
		});

		this.formGroup.controls.week.valueChanges.subscribe(() => {
			this.notifyParent();
		});
	}

	onCurrentMonthClick(): void {
		const { year, month } = DateServiceUtil.getDetailsInformationFromDate(new Date());
		this.formGroup.controls.yearAndMonth.patchValue(`${year}-${month}`);
	}

	writeValue(obj: PersonalAccountFilterFormValues): void {
		console.log('value form filter component', obj);

		// save selected month-year into the form
		this.formGroup.controls.week.reset(-1, { emitEvent: false });
		this.formGroup.controls.yearAndMonth.patchValue(`${obj.year}-${obj.month}`, { emitEvent: false, onlySelf: true });
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

	private notifyParent(): void {
		const [year, month] = this.formGroup.controls.yearAndMonth.value.split('-').map((d) => Number(d));
		const week = this.formGroup.controls.week.value;

		this.onChange({ year, month, week });
	}
}

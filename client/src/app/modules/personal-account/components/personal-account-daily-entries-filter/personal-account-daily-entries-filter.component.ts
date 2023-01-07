import { ChangeDetectionStrategy, Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { PersonalAccountMonthlyDataDetailFragment } from './../../../../core/graphql';
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
	@Input() set weeklyIds(ids: string[] | null) {
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
	 * which monthly details is selected by the parent component
	 */
	@Input() set selectedMonthlyDataDetail(data: PersonalAccountMonthlyDataDetailFragment | null) {
		if (!data) {
			this.displayWeeksInMonth = [];
			this.formGroup.controls.week.reset(-1, { emitEvent: false });
			return;
		}
		this.displayWeeksInMonth = [-1, ...new Set(data.dailyExpenses.map((d) => d.week))];

		// save selected month-year into the form
		this.formGroup.controls.yearAndMonth.patchValue(`${data.year}-${data.month}`, { emitEvent: false, onlySelf: true });
	}

	// @Input() set dailyData

	/**
	 * property to store `${year}-${month}` format from yearsAndMonths
	 */
	displayYearsAndMonths!: string[];

	/**
	 * property to store available weeks from a selected month
	 */
	displayWeeksInMonth: number[] = [];

	readonly formGroup = new FormGroup({
		yearAndMonth: new FormControl<string | null>(''),
		week: new FormControl<number>(-1),
	});

	onChange: (filterState?: unknown) => void = () => {
		/** empty */
	};
	// onTouched callback that will be overridden using `registerOnTouched`
	onTouched = () => {
		/** empty */
	};
	constructor() {}

	ngOnInit(): void {
		this.formGroup.controls.yearAndMonth.valueChanges.subscribe(() => {
			// on month change reset weeks and tags
			this.formGroup.controls.week.reset(-1, { emitEvent: false, onlySelf: true });
			// this.formGroup.controls.tag.reset([], { emitEvent: false, onlySelf: true });
			this.notifyParent();
		});

		this.formGroup.controls.week.valueChanges.subscribe(() => {
			// on week change reset tags
			// this.formGroup.controls.tag.reset([], { emitEvent: false, onlySelf: true });
			this.notifyParent();
		});

		// this.formGroup.controls.tag.valueChanges.subscribe(() => {
		// 	this.notifyParent();
		// });
	}

	onCurrentMonthClick(): void {
		const { year, month } = DateServiceUtil.getDetailsInformationFromDate(new Date());
		this.formGroup.controls.yearAndMonth.patchValue(`${year}-${month}`);
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

	private notifyParent(): void {
		this.onChange(this.formGroup.getRawValue());
	}
}

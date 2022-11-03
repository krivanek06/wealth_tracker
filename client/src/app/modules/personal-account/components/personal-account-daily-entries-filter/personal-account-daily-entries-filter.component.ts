import { ChangeDetectionStrategy, Component, forwardRef, inject, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, FormBuilder, NG_VALUE_ACCESSOR } from '@angular/forms';
import { map, Observable, of, startWith, switchMap } from 'rxjs';
import { ModelFormGroup } from '../../../../shared/models';
import { DailyEntriesFiler } from '../../models';
import { PersonalAccountMonthlyDataDetailFragment, PersonalAccountTagFragment } from './../../../../core/graphql';
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
	@Input() set weeklyIds(ids: string[]) {
		this.displayYearsAndMonths = [
			...new Set(
				ids.map((d) => {
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
			this.displayTags$ = of([]);
			this.formGroup.controls.week.reset(-1, { emitEvent: false });
			this.formGroup.controls.tag.reset([], { emitEvent: false });
			return;
		}
		this.displayWeeksInMonth = [-1, ...new Set(data.dailyData.map((d) => d.week))];

		// save selected month-year into the form
		this.formGroup.controls.yearAndMonth.patchValue(`${data.year}-${data.month}`, { emitEvent: false, onlySelf: true });

		/**
		 * based on the selected week -> filter out avaiable tags,
		 * if no week chosen (-1) then show every tag
		 */
		this.displayTags$ = this.formGroup.controls.week.valueChanges.pipe(
			startWith(-1),
			switchMap(() => of(data)),
			map((monthlyData) => {
				const selectedWeek = this.formGroup.controls.week.getRawValue();

				// data that match selectedWeek or all
				const dailyData = monthlyData.dailyData.filter((d) => (selectedWeek !== -1 ? d.week === selectedWeek : true));

				const result: { total: number; tag: PersonalAccountTagFragment }[] = dailyData.reduce((acc, curr) => {
					const existingIndex = acc.findIndex((d) => d.tag.id === curr.tag.id);
					if (existingIndex === -1) {
						// add tag to acc
						acc.push({ total: 1, tag: curr.tag });
					} else {
						// increment total
						acc[existingIndex].total += 1;
					}

					return acc;
				}, [] as { total: number; tag: PersonalAccountTagFragment }[]);

				return result;
			})
		);
	}

	/**
	 * propery to store `${year}-${month}` format from yearsAndMonths
	 */
	displayYearsAndMonths!: string[];

	/**
	 * property to store available weeks from a selected month
	 */
	displayWeeksInMonth: number[] = [];

	/**
	 * property to store available tags from a selected month & week
	 */
	displayTags$?: Observable<{ total: number; tag: PersonalAccountTagFragment }[]>;

	private fb = inject(FormBuilder);

	readonly formGroup: ModelFormGroup<DailyEntriesFiler> = this.fb.nonNullable.group({
		yearAndMonth: [''],
		week: [-1],
		tag: [['']],
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
		this.formGroup.controls.yearAndMonth.valueChanges.subscribe(() => {
			// on month change reset weeks and tags
			this.formGroup.controls.week.reset(-1, { emitEvent: false, onlySelf: true });
			this.formGroup.controls.tag.reset([''], { emitEvent: false, onlySelf: true });
			this.notifyParent();
		});

		this.formGroup.controls.week.valueChanges.subscribe(() => {
			// on week change reset tags
			this.formGroup.controls.tag.reset([''], { emitEvent: false, onlySelf: true });
			this.notifyParent();
		});

		this.formGroup.controls.tag.valueChanges.subscribe(() => {
			this.notifyParent();
		});
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

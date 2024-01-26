import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { formatDate } from 'date-fns';
import { getDetailsInformationFromDate } from '../../../../core/utils';
import { FormMatInputWrapperComponent } from '../../../../shared/components';
import { InputSource, InputSourceWrapper } from '../../../../shared/models';
import { NO_DATE_SELECTED, PersonalAccountWeeklyAggregationOutput } from './../../../../core/api';

@Component({
	selector: 'app-personal-account-daily-entries-filter',
	template: `
		<div class="flex flex-wrap gap-4 max-sm:order-2">
			<ng-container [formGroup]="formGroup">
				<div class="w-full md:w-[350px]">
					<app-form-mat-input-wrapper
						inputCaption="Filter by date"
						formControlName="dateFilter"
						inputType="SELECT_SOURCE_WRAPPER"
						[inputSourceWrapper]="filterDateInputSourceWrapper"
					></app-form-mat-input-wrapper>
				</div>
			</ng-container>

			<div class="hidden mt-1 h-11 lg:block">
				<button
					mat-stroked-button
					(click)="onCurrentMonthClick()"
					type="button"
					color="primary"
					class="w-full h-full g-button-size-lg"
				>
					Current month
				</button>
			</div>
		</div>

		<!-- add button -->
		<div>
			<button
				mat-stroked-button
				(click)="onAddDailyEntryClick()"
				type="button"
				color="accent"
				class="w-full sm:-mt-6 g-button-size-lg"
			>
				<mat-icon>add</mat-icon>
				Add daily entry
			</button>
		</div>

		<div class="block my-4 sm:hidden">
			<mat-divider></mat-divider>
		</div>
	`,
	styles: [
		`
			:host {
				@apply flex flex-col sm:flex-row items-center gap-x-12 justify-between;

				& > * {
					@apply w-full;

					@screen sm {
						@apply w-auto;
					}
				}
			}
		`,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		FormMatInputWrapperComponent,
		MatButtonModule,
		MatIconModule,
		MatDividerModule,
	],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => PersonalAccountDailyEntriesFilterComponent),
			multi: true,
		},
	],
})
export class PersonalAccountDailyEntriesFilterComponent implements OnInit, ControlValueAccessor {
	@Output() addDailyEntryClickEmitter = new EventEmitter<void>();
	@Input({ required: true }) set weeklyAggregations(data: PersonalAccountWeeklyAggregationOutput[]) {
		this.filterDateInputSourceWrapper = this.getMonthlyInputSource(data);
	}

	/**
	 * values to filter daily data based on some date (year-month-week)
	 */
	filterDateInputSourceWrapper!: InputSourceWrapper[];

	readonly formGroup = new FormGroup({
		dateFilter: new FormControl<string>('', { nonNullable: true }),
	});

	onChange: (dateFilter?: string) => void = () => {};
	onTouched = () => {};

	ngOnInit(): void {
		this.formGroup.controls.dateFilter.valueChanges.subscribe((value) => {
			console.log('onchange', value);
			// value in format year-month-week
			this.onChange(value);
		});
	}

	onAddDailyEntryClick(): void {
		this.addDailyEntryClickEmitter.emit();
	}

	onCurrentMonthClick(): void {
		const today = getDetailsInformationFromDate();
		this.formGroup.controls.dateFilter.patchValue(today.currentDateMonth);
	}

	writeValue(value: string): void {
		console.log('value', value);
		// save selected month-year into the form
		this.formGroup.controls.dateFilter.setValue(value, { emitEvent: false });
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

	/**
	 * from weekly data where we have [year, month], we create InputSourceWrapper based on each month
	 * and items will be weeks in that month
	 * it is used for filtering account data based on month/week
	 *
	 * Values for a month: [year-month-week] [2022-1, 2022-1-1, 2022-1-2, 2022-1-3, 2022-1-4]
	 * Adding value -1 to display total aggregation
	 *
	 * @param weeklyData
	 * @returns
	 */
	getMonthlyInputSource(weeklyData: PersonalAccountWeeklyAggregationOutput[]): InputSourceWrapper[] {
		// ability to filter everything
		const allData: InputSourceWrapper = {
			name: 'All data',
			items: [
				{
					caption: 'Select total aggregation',
					value: NO_DATE_SELECTED,
				},
			],
		};

		// console.log('weeklyData', weeklyData);

		const monthlyInputSources = weeklyData
			.reduce((acc, curr) => {
				// format to 'January, 2022'
				const keyId = `${formatDate(new Date(curr.year, curr.month, 0), 'LLLL')}, ${curr.year}`;
				console.log('keyId', keyId);

				const lastElement: InputSourceWrapper | undefined = acc[acc.length - 1];

				// item that will be added
				const weeklyItem: InputSource = {
					caption: `Week: ${curr.week}, ${keyId}`,
					value: curr.id, // year-month-week: 2022-2-12
				};

				// key in array, append curr as last item for the key
				if (lastElement?.name === keyId) {
					acc[acc.length - 1] = { ...lastElement, items: [...lastElement.items, weeklyItem] };
					return acc;
				}

				// create empty to filter by whole month
				const monthlyItem: InputSource = {
					caption: keyId,
					value: `${curr.year}-${curr.month}`,
				};

				// last item don't match key
				return [...acc, { name: keyId, items: [monthlyItem, weeklyItem] }] as InputSourceWrapper[];
			}, [] as InputSourceWrapper[])
			.reverse();

		return [allData, ...monthlyInputSources];
	}
}

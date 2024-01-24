import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { getCurrentDateDefaultFormat } from '../../../../core/utils';
import { FormMatInputWrapperComponent } from '../../../../shared/components';
import { InputSourceWrapper } from '../../../../shared/models';
import { PersonalAccountDataService } from '../../services';
import { PersonalAccountWeeklyAggregationOutput } from './../../../../core/api';

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
		this.filterDateInputSourceWrapper = this.personalAccountDataService.getMonthlyInputSource(data);
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

	constructor(private personalAccountDataService: PersonalAccountDataService) {}

	ngOnInit(): void {
		this.formGroup.controls.dateFilter.valueChanges.subscribe((value) => {
			// value in format year-month-week
			this.onChange(value);
		});
	}

	onAddDailyEntryClick(): void {
		this.addDailyEntryClickEmitter.emit();
	}

	onCurrentMonthClick(): void {
		this.formGroup.controls.dateFilter.patchValue(getCurrentDateDefaultFormat());
	}

	writeValue(value: string): void {
		// save selected month-year into the form
		this.formGroup.controls.dateFilter.reset(getCurrentDateDefaultFormat(), { emitEvent: false });
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

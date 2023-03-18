import { CommonModule } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	forwardRef,
	Input,
	OnChanges,
	OnInit,
	Output,
	SimpleChanges,
} from '@angular/core';
import { ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { PersonalAccountDetailsFragment } from '../../../../core/graphql';
import { DateServiceUtil } from '../../../../core/utils';
import { FormMatInputWrapperModule } from '../../../../shared/components';
import { InputSourceWrapper } from '../../../../shared/models';
import { PersonalAccountDataService } from '../../services';

@Component({
	selector: 'app-personal-account-daily-entries-filter',
	templateUrl: './personal-account-daily-entries-filter.component.html',
	styleUrls: ['./personal-account-daily-entries-filter.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		FormMatInputWrapperModule,
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
export class PersonalAccountDailyEntriesFilterComponent implements OnInit, ControlValueAccessor, OnChanges {
	@Output() addDailyEntryClickEmitter = new EventEmitter<void>();
	@Input() personalAccountDetails!: PersonalAccountDetailsFragment;

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

	ngOnChanges(changes: SimpleChanges): void {
		if (this.personalAccountDetails) {
			// get dates that we can filter by
			this.filterDateInputSourceWrapper = this.personalAccountDataService.getMonthlyInputSource(
				this.personalAccountDetails.weeklyAggregation
			);
		}
	}

	onAddDailyEntryClick(): void {
		this.addDailyEntryClickEmitter.emit();
	}

	onCurrentMonthClick(): void {
		const { year, month } = DateServiceUtil.getDetailsInformationFromDate(new Date());
		this.formGroup.controls.dateFilter.patchValue(`${year}-${month}`);
	}

	writeValue(value: string): void {
		const { year, month } = DateServiceUtil.getDetailsInformationFromDate(new Date());

		// save selected month-year into the form
		this.formGroup.controls.dateFilter.reset(`${year}-${month}`, { emitEvent: false });
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

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, forwardRef, Input, OnInit } from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { DateFilterFn, MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { InputTypeDateTimePickerConfig } from 'src/app/shared/models';

@Component({
	selector: 'app-date-picker',
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		MatButtonModule,
		MatIconModule,
		MatDatepickerModule,
		MatFormFieldModule,
		MatInputModule,
	],
	templateUrl: './date-picker.component.html',
	styleUrls: ['./date-picker.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => DatePickerComponent),
			multi: true,
		},
	],
})
export class DatePickerComponent implements OnInit {
	/*
		used when inputType === DATEPICKER
	*/
	@Input() inputTypeDateTimePickerConfig?: InputTypeDateTimePickerConfig;

	defaultDateFilter: DateFilterFn<any> = (d: Date) => true;

	onChange: (data: Date) => void = () => {};
	onTouched = () => {};

	selectedDate = new FormControl<Date | null>(null);

	ngOnInit(): void {
		this.selectedDate.valueChanges.subscribe(console.log);
	}

	writeValue(value: number | string | Date): void {
		console.log('date picker', value, new Date(value));
		const formattedDate = new Date(value);
		this.selectedDate.patchValue(formattedDate, { emitEvent: false });
	}

	/**
	 * Register Component's ControlValueAccessor onChange callback
	 */
	registerOnChange(fn: DatePickerComponent['onChange']): void {
		this.onChange = fn;
	}

	/**
	 * Register Component's ControlValueAccessor onTouched callback
	 */
	registerOnTouched(fn: DatePickerComponent['onTouched']): void {
		this.onTouched = fn;
	}
}

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';
import { InputTypeSlider } from '../../../models';

@Component({
	selector: 'app-slider',
	standalone: true,
	imports: [CommonModule, MatSliderModule, ReactiveFormsModule],
	templateUrl: './slider.component.html',
	styleUrls: ['./slider.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => SliderComponent),
			multi: true,
		},
	],
})
export class SliderComponent implements OnInit, ControlValueAccessor {
	@Input() config!: InputTypeSlider;
	@Input() set componentDisabled(disabled: boolean) {
		this.isDisabled = disabled;

		if (disabled) {
			this.selectedValue.disable();
		} else {
			this.selectedValue.enable();
		}
	}

	isDisabled = false;

	selectedValue = new FormControl<number>(0, { nonNullable: true });

	onChange: (data: number) => void = () => {};
	onTouched = () => {};

	ngOnInit(): void {
		this.selectedValue.valueChanges.subscribe((value) => {
			this.onChange(value);
		});
	}

	formatLabel(value: number): string {
		if (this.config?.valueFormatter) {
			return this.config.valueFormatter(value);
		}

		if (value >= 1000) {
			return Math.round(value / 1000) + 'k';
		}

		return `${value}`;
	}

	writeValue(value: number): void {
		this.selectedValue.patchValue(value, { emitEvent: false });
	}

	/**
	 * Register Component's ControlValueAccessor onChange callback
	 */
	registerOnChange(fn: SliderComponent['onChange']): void {
		this.onChange = fn;
	}

	/**
	 * Register Component's ControlValueAccessor onTouched callback
	 */
	registerOnTouched(fn: SliderComponent['onTouched']): void {
		this.onTouched = fn;
	}
}

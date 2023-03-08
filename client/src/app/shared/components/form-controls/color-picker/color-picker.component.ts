import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, forwardRef, Input } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
	selector: 'app-color-picker',
	standalone: true,
	imports: [CommonModule, FormsModule],
	templateUrl: './color-picker.component.html',
	styleUrls: ['./color-picker.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => ColorPickerComponent),
			multi: true,
		},
	],
})
export class ColorPickerComponent {
	selectedColor = '#9c1c1c';

	@Input() componentDisabled = false;

	onChange: (value: string) => void = () => {};
	onTouched = () => {};

	onColorChange(e: any) {
		this.selectedColor = e.target.value;
		this.onChange(this.selectedColor);
	}

	writeValue(value?: string): void {
		this.selectedColor = value ?? '#9c1c1c';
	}

	/**
	 * Register Component's ControlValueAccessor onChange callback
	 */
	registerOnChange(fn: ColorPickerComponent['onChange']): void {
		this.onChange = fn;
	}

	/**
	 * Register Component's ControlValueAccessor onTouched callback
	 */
	registerOnTouched(fn: ColorPickerComponent['onTouched']): void {
		this.onTouched = fn;
	}
}

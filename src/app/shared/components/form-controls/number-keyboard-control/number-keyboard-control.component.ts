import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { KeyboardComponent, KeyboardComponentType } from '../../../models';

@Component({
	selector: 'app-number-keyboard-control',
	standalone: true,
	imports: [CommonModule, MatButtonModule],
	template: `
		<div class="grid grid-cols-3 gap-2">
			<button
				*ngFor="let button of KeyboardComponent"
				type="button"
				mat-stroked-button
				(click)="onButtonClick(button)"
				class="min-h-[52px]"
			>
				{{ button.label }}
			</button>
		</div>
	`,
	styles: [
		`
			:host {
				display: block;
			}
		`,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => NumberKeyboardComponent),
			multi: true,
		},
	],
})
export class NumberKeyboardComponent {
	// outputting number with maximum 2 decimal -> i.e: 122.33
	onChange: (data: string) => void = () => {};
	onTouched = () => {};

	value: string = '';

	KeyboardComponent = KeyboardComponent;

	onButtonClick(keyboard: KeyboardComponentType) {
		// remove last char
		if (keyboard.value === 'back') {
			this.value = this.value.slice(0, this.value.length - 1);
			this.onChange(this.value);
			return;
		}

		// prevent double decimal
		if (this.value.includes('.') && keyboard.value === '.') {
			return;
		}

		// prevent more than 2 values after decimal
		if (this.value.includes('.') && this.value.length - 1 - this.value.indexOf('.') == 2) {
			this.value = this.value.slice(0, this.value.length - 1);
		}

		// append chart
		this.value = this.value + keyboard.value;
		this.onChange(this.value);
	}

	writeValue(value?: string): void {
		this.value = value || '';
	}

	/**
	 * Register Component's ControlValueAccessor onChange callback
	 */
	registerOnChange(fn: NumberKeyboardComponent['onChange']): void {
		this.onChange = fn;
	}

	/**
	 * Register Component's ControlValueAccessor onTouched callback
	 */
	registerOnTouched(fn: NumberKeyboardComponent['onTouched']): void {
		this.onTouched = fn;
	}
}

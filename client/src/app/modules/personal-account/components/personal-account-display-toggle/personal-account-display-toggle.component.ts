import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { PersonalAccountTagFragment } from './../../../../core/graphql';

@Component({
	selector: 'app-personal-account-display-toggle',
	standalone: true,
	imports: [CommonModule, MatButtonModule],
	templateUrl: './personal-account-display-toggle.component.html',
	styleUrls: ['./personal-account-display-toggle.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => PersonalAccountDisplayToggleComponent),
			multi: true,
		},
	],
})
export class PersonalAccountDisplayToggleComponent implements ControlValueAccessor {
	@Input() selectedTag?: PersonalAccountTagFragment | null;

	showHistoryFormControl = false;

	onChange: (data: boolean) => void = () => {};
	onTouched = () => {};

	constructor() {}

	onDisplayClick() {
		this.showHistoryFormControl = !this.showHistoryFormControl;
		this.onChange(this.showHistoryFormControl);
	}

	writeValue(value: boolean): void {
		this.showHistoryFormControl = value;
	}
	/**
	 * Register Component's ControlValueAccessor onChange callback
	 */
	registerOnChange(fn: PersonalAccountDisplayToggleComponent['onChange']): void {
		this.onChange = fn;
	}

	/**
	 * Register Component's ControlValueAccessor onTouched callback
	 */
	registerOnTouched(fn: PersonalAccountDisplayToggleComponent['onTouched']): void {
		this.onTouched = fn;
	}
}

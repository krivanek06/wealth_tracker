import { ChangeDetectionStrategy, Component, forwardRef, OnInit } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
	selector: 'app-main-info',
	templateUrl: './main-info.component.html',
	styleUrls: ['./main-info.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => MainInfoComponent),
			multi: true,
		},
	],
})
export class MainInfoComponent implements OnInit, ControlValueAccessor {
	enabledBudgetingControl = new FormControl<boolean>(false, { nonNullable: true });

	onChange: (value: boolean) => void = () => {};
	onTouched = () => {};

	ngOnInit(): void {
		this.enabledBudgetingControl.valueChanges.subscribe((value) => {
			this.onChange(value);
		});
	}

	writeValue(value: boolean): void {
		this.enabledBudgetingControl.patchValue(value, { emitEvent: false });
	}

	/**
	 * Register Component's ControlValueAccessor onChange callback
	 */
	registerOnChange(fn: MainInfoComponent['onChange']): void {
		this.onChange = fn;
	}

	/**
	 * Register Component's ControlValueAccessor onTouched callback
	 */
	registerOnTouched(fn: MainInfoComponent['onTouched']): void {
		this.onTouched = fn;
	}
}

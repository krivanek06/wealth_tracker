import { ChangeDetectionStrategy, Component, forwardRef, OnInit } from '@angular/core';
import { ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { emailValidator, maxLengthValidator, requiredValidator } from '../../../../../shared/models';

@Component({
	selector: 'app-form-forgot-password',
	templateUrl: './form-forgot-password.component.html',
	styleUrls: ['./form-forgot-password.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => FormForgotPasswordComponent),
			multi: true,
		},
	],
})
export class FormForgotPasswordComponent implements OnInit, ControlValueAccessor {
	formGroup = new FormGroup({
		email: new FormControl('', {
			validators: [requiredValidator, emailValidator, maxLengthValidator(100)],
			nonNullable: true,
		}),
	});

	onChange: (value: LoginUserInput) => void = () => {};
	onTouched = () => {};

	constructor() {}

	ngOnInit(): void {}

	onSubmit(): void {
		this.formGroup.markAllAsTouched();

		if (this.formGroup.invalid) {
			return;
		}

		const result: LoginUserInput = {
			email: this.formGroup.controls.email.value,
		};

		this.onChange(result);
	}

	writeValue(obj: LoginUserInput): void {}

	/**
	 * Register Component's ControlValueAccessor onChange callback
	 */
	registerOnChange(fn: FormForgotPasswordComponent['onChange']): void {
		this.onChange = fn;
	}

	/**
	 * Register Component's ControlValueAccessor onTouched callback
	 */
	registerOnTouched(fn: FormForgotPasswordComponent['onTouched']): void {
		this.onTouched = fn;
	}
}

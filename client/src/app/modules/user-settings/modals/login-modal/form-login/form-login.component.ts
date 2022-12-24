import { ChangeDetectionStrategy, Component, forwardRef, OnInit } from '@angular/core';
import { FormControl, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { LoginUserInput } from '../../../../../core/graphql';
import { emailValidator, maxLengthValidator, requiredValidator } from '../../../../../shared/models';

@Component({
	selector: 'app-form-login',
	templateUrl: './form-login.component.html',
	styleUrls: ['./form-login.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => FormLoginComponent),
			multi: true,
		},
	],
})
export class FormLoginComponent implements OnInit {
	formGroup = new FormGroup({
		email: new FormControl('', {
			validators: [emailValidator, requiredValidator, maxLengthValidator(100)],
			nonNullable: true,
		}),
		password: new FormControl('', { validators: [requiredValidator, maxLengthValidator(25)], nonNullable: true }),
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
			password: this.formGroup.controls.password.value,
		};

		this.onChange(result);
	}

	writeValue(obj: LoginUserInput): void {}

	/**
	 * Register Component's ControlValueAccessor onChange callback
	 */
	registerOnChange(fn: FormLoginComponent['onChange']): void {
		this.onChange = fn;
	}

	/**
	 * Register Component's ControlValueAccessor onTouched callback
	 */
	registerOnTouched(fn: FormLoginComponent['onTouched']): void {
		this.onTouched = fn;
	}
}

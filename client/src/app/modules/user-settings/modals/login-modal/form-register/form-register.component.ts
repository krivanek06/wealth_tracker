import { ChangeDetectionStrategy, Component, forwardRef, OnInit } from '@angular/core';
import { ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { RegisterUserInput } from '../../../../../core/graphql';
import { DialogServiceUtil } from '../../../../../shared/dialogs';
import {
	emailValidator,
	maxLengthValidator,
	minLengthValidator,
	requiredValidator,
} from '../../../../../shared/models';

@Component({
	selector: 'app-form-register',
	templateUrl: './form-register.component.html',
	styleUrls: ['./form-register.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => FormRegisterComponent),
			multi: true,
		},
	],
})
export class FormRegisterComponent implements OnInit, ControlValueAccessor {
	formGroup = new FormGroup({
		email: new FormControl('', {
			validators: [emailValidator, requiredValidator, maxLengthValidator(100)],
			nonNullable: true,
		}),
		password1: new FormControl('', {
			validators: [requiredValidator, maxLengthValidator(25), minLengthValidator(4)],
			nonNullable: true,
		}),
		password2: new FormControl('', {
			validators: [requiredValidator, maxLengthValidator(25), minLengthValidator(4)],
			nonNullable: true,
		}),
	});

	onChange: (value: RegisterUserInput) => void = () => {};
	onTouched = () => {};

	constructor() {}

	ngOnInit(): void {}

	onSubmit(): void {
		if (this.formGroup.invalid) {
			return;
		}
		const controls = this.formGroup.controls;

		// passwords don't match
		if (controls.password1.value !== controls.password2.value) {
			controls.password1.patchValue('');
			controls.password2.patchValue('');
			controls.password1.updateValueAndValidity();
			controls.password2.updateValueAndValidity();
			DialogServiceUtil.showNotificationBar('Passwords do not match!', 'error');
			return;
		}

		const result: RegisterUserInput = {
			email: controls.email.value,
			password: controls.password1.value,
			passwordRepeat: controls.password2.value,
		};

		this.onChange(result);
	}

	writeValue(obj: RegisterUserInput): void {}

	/**
	 * Register Component's ControlValueAccessor onChange callback
	 */
	registerOnChange(fn: FormRegisterComponent['onChange']): void {
		this.onChange = fn;
	}

	/**
	 * Register Component's ControlValueAccessor onTouched callback
	 */
	registerOnTouched(fn: FormRegisterComponent['onTouched']): void {
		this.onTouched = fn;
	}
}

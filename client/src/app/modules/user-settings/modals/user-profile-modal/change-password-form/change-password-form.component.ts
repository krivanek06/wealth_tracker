import { ChangeDetectionStrategy, Component, forwardRef, OnInit } from '@angular/core';
import { ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ChangePasswordInput } from '../../../../../core/graphql';
import { DialogServiceUtil } from '../../../../../shared/dialogs';
import { maxLengthValidator, minLengthValidator, requiredValidator } from '../../../../../shared/models';

@Component({
	selector: 'app-change-password-form',
	templateUrl: './change-password-form.component.html',
	styleUrls: ['./change-password-form.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => ChangePasswordFormComponent),
			multi: true,
		},
	],
})
export class ChangePasswordFormComponent implements OnInit, ControlValueAccessor {
	formGroup = new FormGroup({
		password1: new FormControl('', {
			validators: [requiredValidator, maxLengthValidator(25), minLengthValidator(4)],
			nonNullable: true,
		}),
		password2: new FormControl('', {
			validators: [requiredValidator, maxLengthValidator(25), minLengthValidator(4)],
			nonNullable: true,
		}),
	});

	onChange: (data?: ChangePasswordInput) => void = () => {};

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
			DialogServiceUtil.showNotificationBar('Passwords do not match!', 'error');
			return;
		}

		const result: ChangePasswordInput = {
			password: controls.password1.value,
			passwordRepeat: controls.password2.value,
		};

		this.onChange(result);

		this.formGroup.reset();
		this.formGroup.controls.password1.setErrors(null);
		this.formGroup.controls.password2.setErrors(null);
		this.formGroup.updateValueAndValidity();
	}

	writeValue(obj: any): void {
		// throw new Error('Method not implemented.');
	}

	/**
	 * Register Component's ControlValueAccessor onChange callback
	 */
	registerOnChange(fn: ChangePasswordFormComponent['onChange']): void {
		this.onChange = fn;
	}

	/**
	 * Register Component's ControlValueAccessor onTouched callback
	 */
	registerOnTouched(fn: ChangePasswordFormComponent['onTouched']): void {
		this.onTouched = fn;
	}
}

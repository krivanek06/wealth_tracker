import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DialogServiceUtil } from '../../../../../shared/dialogs';
import { emailValidator, maxLengthValidator, requiredValidator } from '../../../../../shared/models';

@Component({
	selector: 'app-form-register',
	templateUrl: './form-register.component.html',
	styleUrls: ['./form-register.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormRegisterComponent implements OnInit {
	formGroup = new FormGroup({
		email: new FormControl('', { validators: [emailValidator, requiredValidator, maxLengthValidator(100)] }),
		password1: new FormControl('', { validators: [requiredValidator, maxLengthValidator(25)] }),
		password2: new FormControl('', { validators: [requiredValidator, maxLengthValidator(25)] }),
	});

	constructor() {}

	ngOnInit(): void {}

	onSubmit(): void {
		if (this.formGroup.invalid) {
			return;
		}
		if (this.formGroup.controls.password1.value !== this.formGroup.controls.password2.value) {
			this.formGroup.controls.password1.patchValue(null);
			this.formGroup.controls.password2.patchValue(null);
			this.formGroup.controls.password1.updateValueAndValidity();
			this.formGroup.controls.password2.updateValueAndValidity();
			DialogServiceUtil.showNotificationBar('Passwords do not match!', 'error');
			return;
		}
	}
}

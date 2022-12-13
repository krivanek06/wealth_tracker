import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { emailValidator, maxLengthValidator, requiredValidator } from '../../../../../shared/models';

@Component({
	selector: 'app-form-login',
	templateUrl: './form-login.component.html',
	styleUrls: ['./form-login.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormLoginComponent implements OnInit {
	formGroup = new FormGroup({
		email: new FormControl('', { validators: [emailValidator, requiredValidator, maxLengthValidator(100)] }),
		password: new FormControl('', { validators: [requiredValidator, maxLengthValidator(25)] }),
	});

	constructor() {}

	ngOnInit(): void {}

	onSubmit(): void {
		this.formGroup.markAllAsTouched();

		if (this.formGroup.invalid) {
			return;
		}
	}
}

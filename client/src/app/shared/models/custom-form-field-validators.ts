import { AbstractControl, Validators } from '@angular/forms';

export type CustomInputValidatorFn = (
	control: AbstractControl,
	additionalData?: any
) => {
	[errorName: string]: {
		errorText: string;
	};
} | null;

export type AsyncValidatorStats = 'PENDING' | 'INVALID' | 'VALID';

export const requiredValidator: CustomInputValidatorFn = (control) => {
	const requiredValidationErrors = Validators.required(control);

	if (!requiredValidationErrors) {
		return null;
	}

	return {
		required: {
			errorText: 'This field is required',
		},
	};
};

export const wholeNumberValidator: CustomInputValidatorFn = (control) => {
	const wholeNumberValidatorFn = Validators.pattern('^[0-9]*$');
	const validationErrors = wholeNumberValidatorFn(control);

	if (validationErrors) {
		return {
			wholeNumber: {
				errorText: `The given field can only contain whole numbers`,
			},
		};
	}

	return null;
};

export const maxLengthValidator = (maxLength: number): CustomInputValidatorFn => {
	const maxLengthValidatorFn = Validators.maxLength(maxLength);

	return (control: AbstractControl) => {
		const maxLengthValidationErrors = maxLengthValidatorFn(control);

		if (maxLengthValidationErrors) {
			return {
				interval: {
					errorText: `The given field can only contain ${maxLength} characters`,
				},
			};
		}

		return null;
	};
};

export const minLengthValidator = (maxLength: number): CustomInputValidatorFn => {
	const minLengthValidatorFn = Validators.minLength(maxLength);

	return (control: AbstractControl) => {
		const maxLengthValidationErrors = minLengthValidatorFn(control);

		if (maxLengthValidationErrors) {
			return {
				interval: {
					errorText: `The given field must contain at least ${maxLength} characters`,
				},
			};
		}

		return null;
	};
};

export const positiveNumberValidator: CustomInputValidatorFn = (control) => {
	if (!control.value || isNaN(control.value)) {
		return null;
	}

	if (Number(control.value) > 0) {
		return null;
	}

	return {
		required: {
			errorText: 'Enter number higher then 0',
		},
	};
};

export const emailValidator: CustomInputValidatorFn = (control) => {
	const emailValidationErrors = Validators.email(control);

	if (!emailValidationErrors) {
		return null;
	}

	return {
		email: {
			errorText: 'Invalid e-mail address',
		},
	};
};

export const phoneNumberFieldValidator: CustomInputValidatorFn = (control) => {
	if (!control.value) {
		return null;
	}

	const isMatching = !!control.value.match(/^[0-9\+*#]+$/);

	return !isMatching
		? {
				phoneNumber: {
					errorText: 'The phone number can contain only numbers and characters *, + and #',
				},
		  }
		: null;
};

export const intervalValidator = (min: number, max: number) => {
	const minValidatorFn = Validators.min(min);
	const maxValidatorFn = Validators.max(max);

	return (control: AbstractControl) => {
		const minValidationErrors = minValidatorFn(control);
		const maxValidationErrors = maxValidatorFn(control);

		if (minValidationErrors || maxValidationErrors) {
			return {
				interval: {
					errorText: `The given number should be between ${min} and ${max}`,
				},
			};
		}

		return null;
	};
};

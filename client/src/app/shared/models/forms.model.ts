import { FormControl, FormGroup } from '@angular/forms';

// source: https://stackoverflow.com/questions/72507263/angular-14-strictly-typed-reactive-forms-how-to-type-formgroup-model-using-exi
export type ModelFormGroup<T> = FormGroup<{
	[K in keyof T]: FormControl<T[K]>;
}>;

export interface InputSource {
	image?: string;
	value: string | number;
	caption: string;
	additionalData?: unknown;
}

export interface InputTypeDateTimePickerConfig {
	minDate: Date | string;
}

export enum InputTypeEnum {
	TEXT = 'TEXT',
	NUMBER = 'NUMBER',
	EMAIL = 'EMAIL',
	PASSWORD = 'PASSWORD',
	CHECKBOX = 'CHECKBOX',
	RADIO = 'RADIO',
	SLIDE_TOGGLE = 'SLIDE_TOGGLE',
	TIME = 'TIME',
	SELECT = 'SELECT',
	SELECTSEARCH = 'SELECTSEARCH',
	TEXTAREA = 'TEXTAREA',
	MULTISELECT = 'MULTISELECT',
	DATEPICKER = 'DATEPICKER',
	TIMEPICKER = 'TIMEPICKER',
}

export type InputType =
	| 'TEXT'
	| 'NUMBER'
	| 'PASSWORD'
	| 'EMAIL'
	| 'CHECKBOX'
	| 'RADIO'
	| 'SLIDE_TOGGLE'
	| 'DATEPICKER'
	| 'TIMEPICKER'
	| 'SELECT'
	| 'SELECTSEARCH'
	| 'MULTISELECT'
	| 'TEXTAREA';

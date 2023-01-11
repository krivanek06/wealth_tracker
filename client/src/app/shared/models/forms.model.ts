import { FormControl, FormGroup } from '@angular/forms';
import { DateFilterFn } from '@angular/material/datepicker';

// source: https://stackoverflow.com/questions/72507263/angular-14-strictly-typed-reactive-forms-how-to-type-formgroup-model-using-exi
export type ModelFormGroup<T> = FormGroup<{
	[K in keyof T]: FormControl<T[K]>;
}>;

export interface InputSourceWrapper {
	name: string;
	items: InputSource[];
}

export interface InputSource {
	image?: string;
	value: string | number;
	caption: string;
	additionalData?: unknown;
}

export interface InputTypeDateTimePickerConfig {
	minDate?: Date | string;
	maxDate?: Date | string;
	dateFilter?: DateFilterFn<any>;
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
	SELECT_SOURCE_WRAPPER = 'SELECT_SOURCE_WRAPPER',
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
	| 'SELECT_SOURCE_WRAPPER'
	| 'TEXTAREA';

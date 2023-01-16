import { DateFilterFn } from '@angular/material/datepicker';

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

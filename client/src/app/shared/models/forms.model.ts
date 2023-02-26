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

// -------------------------------------------------

export const KeyboardComponent = [
	{ label: 1, value: 1 },
	{ label: 2, value: 2 },
	{ label: 3, value: 3 },
	{ label: 4, value: 4 },
	{ label: 5, value: 5 },
	{ label: 6, value: 6 },
	{ label: 7, value: 7 },
	{ label: 8, value: 8 },
	{ label: 9, value: 9 },
	{ label: '.', value: '.' },
	{ label: 0, value: 0 },
	{ label: '<-', value: 'back' },
] as const;

export type KeyboardComponentType = (typeof KeyboardComponent)[number];

// -------------------------------------------------

export interface InputTypeDateTimePickerConfig {
	minDate?: Date | string;
	maxDate?: Date | string;
	dateFilter?: DateFilterFn<any>;
}

export interface InputTypeSlider {
	min: number;
	max: number;
	step: number;
	valueFormatter?: (value: number) => string;
}

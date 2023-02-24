export const TagColors = {
	income: 'green',
	expense: '#d8270a77',
} as const;

export enum BUDGET_VALUE_FILL_COLORS_KEYS {
	VERY_LOW_VALUE = 'VERY_LOW_VALUE',
	LOW_VALUE = 'LOW_VALUE',
	MEDIUM = 'MEDIUM',
	HIGH = 'HIGH',
	VERY_HIGH = 'VERY_HIGH',
	TOO_MUCH = 'TOO_MUCH',
}

export const NO_DATE_SELECTED = 'NO_DATE_SELECTED';

export type PersonalAccountActionButtonType = 'tagManagement';

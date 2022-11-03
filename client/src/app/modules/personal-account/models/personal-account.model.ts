import { PersonalAccountTagFragment } from './../../../core/graphql';
export interface AccountState {
	total: number;
	incomeTotal: number;
	expenseTotal: number;
}

export interface DailyEntriesFiler {
	yearAndMonth: string; // 2022-7, 2022-8, ...
	week: number; // Week 1, Week 2, ...
	tag: PersonalAccountTagFragment[]; // [Health, Coffee, ...]
}

export interface DisplayTagFormField {
	total?: number;
	tag: PersonalAccountTagFragment;
}

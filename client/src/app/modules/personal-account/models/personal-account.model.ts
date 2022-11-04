import { PersonalAccountTagFragment } from './../../../core/graphql';
export interface AccountState {
	total: number;
	incomeTotal: number;
	expenseTotal: number;
}

export interface DisplayTagFormField {
	total?: number;
	tag: PersonalAccountTagFragment;
}

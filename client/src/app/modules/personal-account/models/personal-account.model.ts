export interface AccountState {
	total: number;
	incomeTotal: number;
	expenseTotal: number;
}

export interface DailyEntriesFiler {
	yearAndMonth: string; // 2022-7, 2022-8, ...
	week: number;
	day: number;
	tag: string;
}

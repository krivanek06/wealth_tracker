export interface InvestmentAccountPeriodChange {
	// 1 week, 1 month, ...
	title: string;
	value: number;
	valuePrct: number;
}

export const PeriodChangeDate = [
	{
		value: 1,
		name: 'Daily',
	},
	{
		value: 7,
		name: 'Weekly',
	},
	{
		value: 14,
		name: '2 Weeks',
	},
	{
		value: 31,
		name: '1 Month',
	},
	{
		value: 62,
		name: '2 Months',
	},
	{
		value: 93,
		name: '3 Months',
	},
	{
		value: 183,
		name: '6 Months',
	},
	{
		value: 365,
		name: '1 Year',
	},
] as const;

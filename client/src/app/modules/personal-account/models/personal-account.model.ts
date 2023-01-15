import { TagDataType } from '../../../core/graphql';

export interface AccountState {
	total: number;
	incomeTotal: number;
	expenseTotal: number;
}

/**
 * Interface used in PersonalAccountExpensesByTagComponent to be able to display
 * additional information for a specific tag such as:
 *  - total value - for a specific time period, month, week in a month
 *  - total entries - how many entries were created for a time period
 */
export interface PersonalAccountTagAggregation {
	color: string;
	/** URL to image */
	imageUrl: string;
	/** Name of the tag */
	name: string;
	type: TagDataType;

	/* date when was the last entry added */
	lastDataEntryDate: string;

	/* true or false if weekly or monthly data aggregation */
	isWeeklyView: boolean;

	/* how many entries for a specific view has been created */
	totalEntries: number;

	/* total value for a specific view */
	totalValue: number;

	/**
	 * if time period is month, then it is same as budgedMonthly, otherwise
	 * otherwise it is weekly budget (budgedMonthly / weeks in month)
	 */
	budgetToTimePeriod?: number | null;

	/**
	 * basically how much % is totalValue from budgetToTimePeriod,
	 * so if we under the budget it will be under 100%, or can be over
	 */
	budgetToTimePeriodFilledPrct: number;
}

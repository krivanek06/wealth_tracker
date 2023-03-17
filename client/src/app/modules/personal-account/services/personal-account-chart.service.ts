import { Injectable } from '@angular/core';
import {
	PersonalAccountAggregationDataOutput,
	PersonalAccountDailyDataOutputFragment,
	PersonalAccountDetailsFragment,
	PersonalAccountTagFragment,
	PersonalAccountWeeklyAggregationOutput,
	TagDataType,
} from '../../../core/graphql';
import { DateServiceUtil } from '../../../core/utils';
import { createGenericChartSeriesPie } from '../../../shared/functions';
import { ChartType, GenericChartSeries, GenericChartSeriesPie } from '../../../shared/models';
import { AccountState, TagColors } from '../models';

@Injectable({
	providedIn: 'root',
})
export class PersonalAccountChartService {
	constructor() {}

	/**
	 *
	 * @param data
	 * @returns accumulated expenses, incomes and their difference
	 */
	getAccountState(data: PersonalAccountAggregationDataOutput[]): AccountState {
		const entriesTotal = data.reduce((acc, curr) => acc + curr.entries, 0);
		const expenseTotal = data.filter((d) => d.tag.type === TagDataType.Expense).reduce((a, b) => a + b.value, 0);
		const incomeTotal = data.filter((d) => d.tag.type === TagDataType.Income).reduce((a, b) => a + b.value, 0);
		const total = incomeTotal - expenseTotal;

		const result: AccountState = {
			expenseTotal,
			incomeTotal,
			total,
			entriesTotal,
			recurringValueTotal: 0, // todo
			recurringEntriesTotal: 0, // todo
		};

		return result;
	}

	getAccountStateByDate(data: PersonalAccountWeeklyAggregationOutput[], dateFormat: string): AccountState {
		const [year, month, week] = DateServiceUtil.dateSplitter(dateFormat);

		// filter out relevant data
		const weeklyAggregationFiltered = data.filter(
			(d) => d.year === year && d.month === month && (week ? d.week === week : 1)
		);

		// flatten array
		const aggregationOutput = weeklyAggregationFiltered.reduce(
			(acc, curr) => [...acc, ...curr.data],
			[] as PersonalAccountAggregationDataOutput[]
		);

		return this.getAccountState(aggregationOutput);
	}

	getAccountStateByDailyData(data: PersonalAccountDailyDataOutputFragment[]): AccountState {
		const entriesTotal = data.length;
		const expenseTotal = data.filter((d) => d.tag.type === TagDataType.Expense).reduce((a, b) => a + b.value, 0);
		const incomeTotal = data.filter((d) => d.tag.type === TagDataType.Income).reduce((a, b) => a + b.value, 0);
		const total = incomeTotal - expenseTotal;

		const result: AccountState = {
			expenseTotal,
			incomeTotal,
			total,
			entriesTotal,
			recurringValueTotal: 0, // todo
			recurringEntriesTotal: 0, // todo
		};

		return result;
	}

	/**
	 *
	 * @param data
	 * @param aggregation
	 * @returns weekly or monthly categories in string format
	 */
	getChartCategories(data: PersonalAccountDetailsFragment, aggregation: 'week' | 'month' = 'week'): string[] {
		const categories = data.weeklyAggregaton.map((d) => {
			const monthName = DateServiceUtil.formatDate(new Date(d.year, d.month), 'LLL');
			return `Week: ${d.week}, ${monthName}`;
		});
		return categories;
	}

	/**
	 * Aggregates incomes and expenses into a chart format for account growth overview
	 * Aggregation use historical data, tomorrow is calculated from today's 'total'
	 *
	 * @param data aggregation from personal account
	 * @param aggregation type of aggreation
	 * @returns GenericChartSeries data type
	 */
	getAccountGrowthChartData(
		data: PersonalAccountDetailsFragment,
		aggregation: 'week' | 'month' = 'week',
		activeTagIds: string[] = []
	): GenericChartSeries {
		// aggregates total income / expenses on a weekly bases
		const weeklyAggregation: number[] = data.weeklyAggregaton.map((d) =>
			d.data.reduce((acc, curr) => {
				if (curr.tag.type === TagDataType.Income) {
					return acc + curr.value;
				}

				// subtract only if tag is selected or activeTags is empty
				return acc - (activeTagIds.length == 0 || activeTagIds.includes(curr.tag.id) ? curr.value : 0);
			}, 0)
		);

		// transforms weeklyAggregation so that each data is depended on the previous
		const weeklyTotalSeries = weeklyAggregation.reduce((acc, curr) => {
			return acc.length === 0 ? [curr] : [...acc, acc[acc.length - 1] + curr];
		}, [] as number[]);

		const series: GenericChartSeries = {
			name: 'Total',
			data: weeklyTotalSeries,
			type: ChartType.line,
		};

		return series;
	}

	/**
	 *
	 * @param data
	 * @param aggregation
	 * @param activeTags list of tag names by which to aggregate date, if empty, aggregate all tags
	 * @returns [Income, Expense] chart data based on the aggregation
	 */
	getAccountIncomeExpenseChartData(
		data: PersonalAccountDetailsFragment,
		aggregation: 'week' | 'month' = 'week',
		activeTagIds: string[] = []
	): [GenericChartSeries, GenericChartSeries] {
		// reduce data
		const income: number[] = data.weeklyAggregaton.map((d) =>
			d.data.filter((d) => d.tag.type === TagDataType.Income).reduce((acc, curr) => acc + curr.value, 0)
		);
		const expense: number[] = data.weeklyAggregaton.map((d) =>
			d.data
				.filter(
					(d) => d.tag.type === TagDataType.Expense && (activeTagIds.length === 0 || activeTagIds.includes(d.tag.id))
				)
				.reduce((acc, curr) => acc + curr.value, 0)
		);

		// create format
		const incomeSeries: GenericChartSeries = {
			name: 'Income',
			data: income,
			type: ChartType.column,
			color: TagColors.income,
		};
		const expenseSeries: GenericChartSeries = {
			name: 'Expense',
			data: expense,
			type: ChartType.line,
			color: TagColors.expense,
		};

		return [incomeSeries, expenseSeries];
	}

	/**
	 * Aggregates weekly expenses by tag into week/month format
	 *
	 * @param data aggregation from personal account
	 * @param aggregation type of aggreation
	 * @param availableExpenseTags - helps to create stacked chart so we know by which tags to stack by
	 * @returns GenericChartSeries data type
	 */
	getWeeklyExpenseChartData(
		data: PersonalAccountDetailsFragment,
		aggregation: 'week' | 'month' = 'week',
		availableExpenseTags: PersonalAccountTagFragment[] = [],
		activeTagIds: string[] = []
	): GenericChartSeries[] {
		// go through all weekly data and for each availableExpenseTags save a value
		// if tag not exist for the specifc week, put 0
		const series = data.weeklyAggregaton
			.map((weeklyData) =>
				availableExpenseTags
					// filter out only active tags
					.filter(
						(tag) => tag.type === TagDataType.Expense && (activeTagIds.length === 0 || activeTagIds.includes(tag.id))
					)
					.reduce((acc, curr) => {
						// find TAG daily data value (or 0) in selected week
						const weeklyDataValueForTag = weeklyData.data.find((d) => d.tag.id === curr.id)?.value ?? 0;
						const result: GenericChartSeries = {
							name: curr.name,
							data: [weeklyDataValueForTag],
							color: curr.color,
							type: ChartType.column,
						};

						return [...acc, result];
					}, [] as GenericChartSeries[])
			)
			.reduce((acc, curr) => {
				// first loop
				if (acc.length === 0) {
					return curr;
				}
				// merge curr into acc
				curr.forEach((tagChartData, index) => {
					acc[index].data = [...acc[index].data, tagChartData.data[0]];
				});

				return acc;
			}, [] as GenericChartSeries[]);

		return series;
	}

	getExpenseAllocationChartData(
		data: (PersonalAccountDailyDataOutputFragment | PersonalAccountAggregationDataOutput)[]
	): GenericChartSeriesPie {
		const notIncomeData = data.filter((d) => d.tag.type !== TagDataType.Income);
		const seriesData = createGenericChartSeriesPie(notIncomeData, 'tag', 'name', 'color', 'imageUrl');

		return { data: seriesData, colorByPoint: true, name: 'Expenses', innerSize: '80%', type: 'pie' };
	}
}

import { Injectable } from '@angular/core';
import { AccountState } from '../models';
import { PersonalAccountOverviewFragment, TagDataType } from './../../../core/graphql';
import { ChartType, GenericChartSeries } from './../../../shared/models';
import { DateServiceUtil } from './../../../shared/utils';

@Injectable({
	providedIn: 'root',
})
export class PersonalAccountDataModificationService {
	constructor() {}

	/**
	 *
	 * @param data
	 * @returns accumulated expenses, incomes and their difference
	 */
	getAccountState(data: PersonalAccountOverviewFragment): AccountState {
		const expenseTotal = data.yearlyAggregaton
			.filter((d) => d.tagType === TagDataType.Expense)
			.reduce((a, b) => a + b.value, 0);
		const incomeTotal = data.yearlyAggregaton
			.filter((d) => d.tagType === TagDataType.Income)
			.reduce((a, b) => a + b.value, 0);
		const total = incomeTotal - expenseTotal;

		const result: AccountState = {
			expenseTotal,
			incomeTotal,
			total,
		};

		return result;
	}

	/**
	 *
	 * @param data
	 * @param aggregation
	 * @returns weekly or monthly categories in string format
	 */
	getChartCategories(data: PersonalAccountOverviewFragment, aggregation: 'week' | 'month' = 'week'): string[] {
		const categories = data.weeklyAggregaton.map((d) => {
			const monthName = DateServiceUtil.formatDate(new Date(d.year, d.month), 'LLL');
			return `Week: ${d.week}, ${monthName}`;
		});
		return categories;
	}

	/**
	 * Aggregates incomes and expenses into a chart format
	 * for account growth overview
	 *
	 * @param data aggregation from personal account
	 * @param aggregation type of aggreation
	 * @returns GenericChartSeries data type
	 */
	getAccountgrowthChartData(
		data: PersonalAccountOverviewFragment,
		aggregation: 'week' | 'month' = 'week'
	): GenericChartSeries {
		// add together weekly income and expense
		const weeklyIncomeSeries: number[] = data.weeklyAggregaton.map((d) =>
			d.data.reduce((acc, curr) => acc + (curr.tagType === TagDataType.Income ? curr.value : -curr.value), 0)
		);
		const series: GenericChartSeries = { name: 'Total', data: weeklyIncomeSeries, type: ChartType.column };

		return series;
	}

	/**
	 * Aggregates weekly expenses by tag into week/month format
	 *
	 * @param data aggregation from personal account
	 * @param aggregation type of aggreation
	 * @returns GenericChartSeries data type
	 */
	getWeeklyExpenseChartData(
		data: PersonalAccountOverviewFragment,
		aggregation: 'week' | 'month' = 'week'
	): GenericChartSeries[] {
		const series = data.weeklyAggregaton.reduce((acc, curr) => {
			curr.data
				.filter((d) => d.tagType === TagDataType.Expense)
				.forEach((d, index) => {
					// index of tagName in accumulation
					const savedTagIndex = acc.findIndex((accData) => accData.name === d.tagName);

					if (savedTagIndex === -1) {
						// tag not yet save = new data
						acc.push({
							name: d.tagName,
							data: [d.value],
							color: d.tagColor,
							type: ChartType.line,
						} as GenericChartSeries);
					} else {
						// add another series into saved tag array
						acc[savedTagIndex].data.push(d.value);
					}
				});

			return acc;
		}, [] as GenericChartSeries[]);

		return series;
	}
}

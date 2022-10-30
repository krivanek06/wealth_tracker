import { Injectable } from '@angular/core';
import { AccountState } from '../models';
import { PersonalAccountOverviewFragment, TagDataType } from './../../../core/graphql';
import { GenericChartSeries, GenericChartSeriesInput } from './../../../shared/models';
import { DateServiceUtil } from './../../../shared/utils';

@Injectable({
	providedIn: 'root',
})
export class PersonalAccountDataModificationService {
	constructor() {}

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
	 * Aggregates incomes and expenses into a chart format
	 *
	 * @param data aggregation from personal account
	 * @param aggregation type of aggreation
	 * @returns GenericChartSeriesInput data type
	 */
	getWeeklyChartData(
		data: PersonalAccountOverviewFragment,
		aggregation: 'week' | 'month' = 'week'
	): GenericChartSeriesInput {
		// add together weekly income and expense
		const weeklyIncomeSeries: number[] = data.weeklyAggregaton.map((d) =>
			d.data.reduce((acc, curr) => acc + (curr.tagType === TagDataType.Income ? curr.value : -curr.value), 0)
		);
		const series: GenericChartSeries = { name: data.name, data: weeklyIncomeSeries };
		const categories = data.weeklyAggregaton.map((d) => {
			const monthName = DateServiceUtil.formatDate(new Date(d.year, d.month), 'LLLL');
			return `Week: ${d.week}, ${monthName}  ${d.year}`;
		});

		return { series: [series], categories };
	}

	getWeeklyExpenseChartData(
		data: PersonalAccountOverviewFragment,
		aggregation: 'week' | 'month' = 'week'
	): GenericChartSeriesInput {
		const series = data.weeklyAggregaton.reduce((acc, curr) => {
			curr.data
				.filter((d) => d.tagType === TagDataType.Expense)
				.forEach((d, index) => {
					// index of tagName in accumulation
					const savedTagIndex = acc.findIndex((accData) => accData.name === d.tagName);

					if (savedTagIndex === -1) {
						// tag not yet save = new data
						acc.push({ name: d.tagName, data: [d.value], color: d.tagColor } as GenericChartSeries);
					} else {
						// add another series into saved tag array
						acc[savedTagIndex].data.push(d.value);
					}
				});

			return acc;
		}, [] as GenericChartSeries[]);

		const categories = data.weeklyAggregaton.map((d) => {
			const monthName = DateServiceUtil.formatDate(new Date(d.year, d.month), 'LLLL');
			return `Week: ${d.week}, ${monthName}  ${d.year}`;
		});

		return { series, categories };
	}
}

import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import {
	chartColors1,
	GenericChartSeries,
	GenericChartSeriesInput,
	SwimlaneChartDataSeries,
} from '../../../../shared/models';
import { AccountState, ValueItem } from '../../models';
import { PersonalAccountApiService } from './../../../../core/api';
import { PersonalAccountOverviewFragment, TagDataType } from './../../../../core/graphql';
import { DateServiceUtil } from './../../../../shared/utils';

@Component({
	selector: 'app-personal-account',
	templateUrl: './personal-account.component.html',
	styleUrls: ['./personal-account.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonalAccountComponent implements OnInit {
	@Input() personalAccount!: PersonalAccountOverviewFragment;

	yearlyChartData!: SwimlaneChartDataSeries[];
	weeklyChartData!: GenericChartSeriesInput;
	weeklyExpenseChartData!: GenericChartSeriesInput;
	valueItems: ValueItem[] = [];
	accountState!: AccountState;

	constructor(private personalAccountApiService: PersonalAccountApiService) {}

	ngOnInit(): void {
		this.yearlyChartData = this.getYearlyData(this.personalAccount);
		this.weeklyChartData = this.getWeeklyChartData(this.personalAccount);
		this.weeklyExpenseChartData = this.getWeeklyExpenseChartData(this.personalAccount);
		this.valueItems = this.getYearlyExpenseValueItems(this.personalAccount);
		this.accountState = this.getAccountState(this.personalAccount);
	}

	private getAccountState(data: PersonalAccountOverviewFragment): AccountState {
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

	private getYearlyExpenseValueItems(data: PersonalAccountOverviewFragment): ValueItem[] {
		const yearlyExpenses = data.yearlyAggregaton.filter((d) => d.tagType === TagDataType.Expense);
		const totalYearlyExpense = yearlyExpenses.reduce((a, b) => a + b.value, 0);

		const valueItems = yearlyExpenses.map((d, index) => {
			const colorIdex = index % chartColors1.length;
			const result: ValueItem = {
				name: `$ ${d.value}`,
				description: `${d.tagName} (${d.entries})`,
				value: d.value / totalYearlyExpense,
				color: chartColors1[colorIdex],
				isPercent: true,
			};
			return result;
		});

		return valueItems;
	}

	private getYearlyData(data: PersonalAccountOverviewFragment): SwimlaneChartDataSeries[] {
		return data.yearlyAggregaton.map((d) => {
			return { name: d.tagName, value: d.value } as SwimlaneChartDataSeries;
		});
	}

	/**
	 * Aggregates incomes and expenses into a chart format
	 *
	 * @param data aggregation from personal account
	 * @param aggregation type of aggreation
	 * @returns GenericChartSeriesInput data type
	 */
	private getWeeklyChartData(
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

	private getWeeklyExpenseChartData(
		data: PersonalAccountOverviewFragment,
		aggregation: 'week' | 'month' = 'week'
	): GenericChartSeriesInput {
		const series = data.weeklyAggregaton.reduce((acc, curr) => {
			curr.data
				.filter((d) => d.tagType === TagDataType.Expense)
				.forEach((d) => {
					// index of tagName in accumulation
					const savedTagIndex = acc.findIndex((accData) => accData.name === d.tagName);

					if (savedTagIndex === -1) {
						// tag not yet save = new data
						acc.push({ name: d.tagName, data: [d.value] } as GenericChartSeries);
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

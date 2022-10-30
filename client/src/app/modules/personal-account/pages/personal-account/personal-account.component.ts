import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { GenericChartSeries, GenericChartSeriesInput, SwimlaneChartDataSeries } from '../../../../shared/models';
import { PersonalAccountApiService } from './../../../../core/api';
import { PersonalAccountOverviewFragment, TagDataType } from './../../../../core/graphql';
import { DateServiceUtil } from './../../../../shared/utils';

@Component({
	selector: 'app-personal-account',
	templateUrl: './personal-account.component.html',
	styleUrls: ['./personal-account.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonalAccountComponent implements OnInit, OnChanges {
	@Input() personalAccount!: PersonalAccountOverviewFragment;

	yearlyChartData!: SwimlaneChartDataSeries[];
	weeklyChartData!: GenericChartSeriesInput;
	weeklyExpenseChartData!: GenericChartSeriesInput;

	constructor(private personalAccountApiService: PersonalAccountApiService) {}
	ngOnChanges(changes: SimpleChanges): void {
		if (changes?.['personalAccount']?.currentValue) {
			this.yearlyChartData = this.getYearlyData(this.personalAccount);
			this.weeklyChartData = this.getWeeklyChartData(this.personalAccount);
			this.weeklyExpenseChartData = this.getWeeklyExpenseChartData(this.personalAccount);
		}
	}

	ngOnInit(): void {}

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

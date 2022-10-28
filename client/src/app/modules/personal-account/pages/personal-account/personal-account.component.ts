import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { SwimlaneChartData, SwimlaneChartDataSeries } from '../../../../shared/models';
import { PersonalAccountApiService } from './../../../../core/api';
import { PersonalAccountOverviewFragment, TagDataType } from './../../../../core/graphql';

@Component({
	selector: 'app-personal-account',
	templateUrl: './personal-account.component.html',
	styleUrls: ['./personal-account.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonalAccountComponent implements OnInit {
	@Input() set personalAccount(data: PersonalAccountOverviewFragment) {
		// get yearly aggregation
		this.yearlyChartData = data.yearlyAggregaton.map((d) => {
			return { name: d.tagName, value: d.value } as SwimlaneChartDataSeries;
		});

		// get weekly income aggregation
		const weeklyIncomeSeries: SwimlaneChartDataSeries[] = data.weeklyAggregaton.map((d) => {
			// add together weekly income and expense
			const weeklyIncome = d.data.reduce(
				(acc, curr) => acc + (curr.tagType === TagDataType.Income ? curr.value : -curr.value),
				0
			);
			return { name: d.id, value: weeklyIncome };
		});
		this.weeklyChartData = { name: data.name, series: weeklyIncomeSeries };

		// get weekly expense aggregation
		/*
          [{
            "name": "Shopping",
            "series": [
              {
                "value": 2983,
                "name": "2022-9-42"
              },
            ]
          }]
    */
		this.weeklyExpenseChartData = data.weeklyAggregaton.reduce((acc, curr) => {
			curr.data
				.filter((d) => d.tagType === TagDataType.Expense)
				.forEach((d) => {
					// index of tagName in accumulation
					const savedTagIndex = acc.findIndex((accData) => accData.name === d.tagName);

					if (savedTagIndex === -1) {
						// tag not yet save = new data
						const newData = { name: d.tagName, series: [{ name: curr.id, value: d.value }] } as SwimlaneChartData;
						acc.push(newData);
					} else {
						// add another series into saved tag array
						acc[savedTagIndex].series.push({ name: curr.id, value: d.value });
					}
				});

			return acc;
		}, [] as SwimlaneChartData[]);
	}

	yearlyChartData!: SwimlaneChartDataSeries[];
	weeklyChartData!: SwimlaneChartData;
	weeklyExpenseChartData!: SwimlaneChartData[];

	constructor(private personalAccountApiService: PersonalAccountApiService) {}

	ngOnInit(): void {}
}

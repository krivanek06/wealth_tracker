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

		// get weekly aggregation
		const weeklyIncomeSeries: SwimlaneChartDataSeries[] = data.weeklyAggregaton.map((d) => {
			// add together weekly income and expense
			const weeklyIncome = d.data.reduce(
				(acc, curr) => acc + (curr.tagType === TagDataType.Income ? curr.value : -curr.value),
				0
			);
			return { name: d.id, value: weeklyIncome };
		});
		this.weeklyChartData = { name: data.name, series: weeklyIncomeSeries };
	}

	yearlyChartData!: SwimlaneChartDataSeries[];
	weeklyChartData!: SwimlaneChartData;

	constructor(private personalAccountApiService: PersonalAccountApiService) {}

	ngOnInit(): void {}
}

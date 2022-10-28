import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';
import { PersonalAccountApiService } from './../../../../core/api';
import {
	PersonalAccountMonthlyDataDetailFragment,
	PersonalAccountMonthlyDataOverviewFragment,
	TagDataType,
} from './../../../../core/graphql';
import { SwimlaneChartDataSeries } from './../../../../shared/models';

@Component({
	selector: 'app-personal-account-daily-data-container',
	templateUrl: './personal-account-daily-data-container.component.html',
	styleUrls: ['./personal-account-daily-data-container.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonalAccountDailyDataContainerComponent implements OnInit {
	@Input() personalAccountMonthlyData!: PersonalAccountMonthlyDataOverviewFragment[];

	monthlyDataDetail$!: Observable<PersonalAccountMonthlyDataDetailFragment>;

	/*
    [{
      "name": "SHOPPING",
      "value": 40632,
    }]
  */
	expenseAllocationChartData$!: Observable<SwimlaneChartDataSeries[]>;

	constructor(private personalAccountApiService: PersonalAccountApiService) {}

	ngOnInit(): void {
		const monthlyDataId = this.personalAccountMonthlyData[0].id;
		this.monthlyDataDetail$ = this.personalAccountApiService.getPersonalAccountMonthlyDataById(monthlyDataId);

		this.expenseAllocationChartData$ = this.monthlyDataDetail$.pipe(
			map((result) =>
				result.dailyData.reduce((acc, curr) => {
					// ignore income
					if (curr.tag.type === TagDataType.Income) {
						return acc;
					}
					// find index of saved tag
					const dataIndex = acc.findIndex((d) => d.name === curr.tag.name);
					if (dataIndex === -1) {
						acc = [...acc, { name: curr.tag.name, value: curr.value }]; // new tag
					} else {
						acc[dataIndex].value += curr.value; // increase value for tag
					}

					return acc;
				}, [] as SwimlaneChartDataSeries[])
			)
		);
	}
}

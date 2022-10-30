import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';
import { PersonalAccountApiService } from './../../../../core/api';
import {
	PersonalAccountMonthlyDataDetailFragment,
	PersonalAccountMonthlyDataOverviewFragment,
	TagDataType,
} from './../../../../core/graphql';
import { ChartType, GenericChartSeriesData, GenericChartSeriesPie } from './../../../../shared/models';

@Component({
	selector: 'app-personal-account-daily-data-container',
	templateUrl: './personal-account-daily-data-container.component.html',
	styleUrls: ['./personal-account-daily-data-container.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonalAccountDailyDataContainerComponent implements OnInit {
	@Input() personalAccountMonthlyData!: PersonalAccountMonthlyDataOverviewFragment[];

	monthlyDataDetail$!: Observable<PersonalAccountMonthlyDataDetailFragment>;
	expenseAllocationChartData$!: Observable<GenericChartSeriesPie>;

	ChartType = ChartType;

	constructor(private personalAccountApiService: PersonalAccountApiService) {}

	ngOnInit(): void {
		const monthlyDataId = this.personalAccountMonthlyData[0].id;
		this.monthlyDataDetail$ = this.personalAccountApiService.getPersonalAccountMonthlyDataById(monthlyDataId);

		this.expenseAllocationChartData$ = this.monthlyDataDetail$.pipe(
			map((result) => this.formatToExpenseAllocationChartDatta(result))
		);
	}

	private formatToExpenseAllocationChartDatta(data: PersonalAccountMonthlyDataDetailFragment): GenericChartSeriesPie {
		const seriesData = data.dailyData.reduce((acc, curr) => {
			// ignore income
			if (curr.tag.type === TagDataType.Income) {
				return acc;
			}
			// find index of saved tag
			const dataIndex = acc.findIndex((d) => d.name === curr.tag.name);
			if (dataIndex === -1) {
				acc = [...acc, { name: curr.tag.name, y: curr.value }]; // new tag
			} else {
				acc[dataIndex].y += curr.value; // increase value for tag
			}

			return acc;
		}, [] as GenericChartSeriesData[]);

		return { data: seriesData, colorByPoint: true, name: 'Expenses', innerSize: '30%' };
	}
}

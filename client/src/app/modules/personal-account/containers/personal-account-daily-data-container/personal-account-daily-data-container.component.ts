import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';
import { PersonalAccountApiService } from './../../../../core/api';
import {
	PersonalAccountMonthlyDataDetailFragment,
	PersonalAccountOverviewFragment,
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
	@Input() personalAccount!: PersonalAccountOverviewFragment;
	weeklyIds!: string[]; // 2022-7-32, 2022-7-33, ...
	monthlyDataId!: string;
	monthlyDataDetail$!: Observable<PersonalAccountMonthlyDataDetailFragment>;
	expenseAllocationChartData$!: Observable<GenericChartSeriesPie>;

	ChartType = ChartType;

	constructor(private personalAccountApiService: PersonalAccountApiService) {}

	ngOnInit(): void {
		this.monthlyDataId = this.personalAccount.monthlyData[0].id;
		this.weeklyIds = this.personalAccount.weeklyAggregaton.map((d) => d.id);
		this.monthlyDataDetail$ = this.personalAccountApiService.getPersonalAccountMonthlyDataById(this.monthlyDataId);

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

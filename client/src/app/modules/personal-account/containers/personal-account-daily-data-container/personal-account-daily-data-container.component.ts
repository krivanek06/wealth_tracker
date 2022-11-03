import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { map, Observable, startWith, switchMap } from 'rxjs';
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
	monthlyDataDetail$!: Observable<PersonalAccountMonthlyDataDetailFragment>;
	monthlyDataDetailTable$!: Observable<PersonalAccountMonthlyDataDetailFragment>;
	expenseAllocationChartData$!: Observable<GenericChartSeriesPie>;

	ChartType = ChartType;

	private fb = inject(FormBuilder);
	readonly filterControl = this.fb.nonNullable.control({
		yearAndMonth: '',
		week: -1,
		tag: [''],
	});

	constructor(private personalAccountApiService: PersonalAccountApiService) {}

	ngOnInit(): void {
		//this.monthlyDataId = this.personalAccount.monthlyData[0].id;
		const data = this.personalAccount.monthlyData[0];
		this.filterControl.patchValue(
			{ yearAndMonth: `${data.year}-${data.month}`, tag: [''], week: -1 },
			{ emitEvent: false }
		);
		this.weeklyIds = this.personalAccount.weeklyAggregaton.map((d) => d.id);

		// load / filter date based on filter change
		this.monthlyDataDetail$ = this.filterControl.valueChanges.pipe(
			startWith(this.filterControl.getRawValue()),
			switchMap((filterValues) => {
				const [year, month] = filterValues.yearAndMonth.split('-').map((d) => Number(d));
				const monthlyDataOverview = this.personalAccount.monthlyData.find((d) => d.year === year && d.month === month);
				if (!monthlyDataOverview) {
					throw new Error('Currect monthly data not found');
				}
				// TODO this is triggered 3x , why ?
				console.log('monthlyData', filterValues);
				return this.personalAccountApiService.getPersonalAccountMonthlyDataById(monthlyDataOverview.id);
			})
		);

		this.monthlyDataDetailTable$ = this.monthlyDataDetail$.pipe(
			map((monthlyDataDetails) => {
				const selectedTags = this.filterControl.getRawValue().tag;
				const selectedWeek = this.filterControl.getRawValue().week;

				const filteredDailyData = monthlyDataDetails.dailyData.filter((d) => {
					if (selectedTags.length !== 0 && selectedTags[0] !== '' && !selectedTags.includes(d.tag.name)) {
						return false;
					}
					if (selectedWeek !== -1 && selectedWeek !== d.week) {
						return false;
					}

					return true;
				});
				return { ...monthlyDataDetails, dailyData: filteredDailyData, dailyEntries: filteredDailyData.length };
			})
		);

		// calculate expense chart for filtered data
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

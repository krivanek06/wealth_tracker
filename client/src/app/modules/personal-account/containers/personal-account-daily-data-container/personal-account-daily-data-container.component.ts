import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { map, Observable, startWith, switchMap } from 'rxjs';
import { PersonalAccountFilterFormValues } from '../../models';
import { PersonalAccountFacadeService } from './../../../../core/api';
import {
	PersonalAccountDailyDataOutputFragment,
	PersonalAccountOverviewFragment,
	TagDataType,
} from './../../../../core/graphql';
import { ChartType, GenericChartSeriesData, GenericChartSeriesPie } from './../../../../shared/models';
import { DateServiceUtil } from './../../../../shared/utils';
import { PersonalAccountDailyDataEntryComponent } from './../../modals';

@Component({
	selector: 'app-personal-account-daily-data-container',
	templateUrl: './personal-account-daily-data-container.component.html',
	styleUrls: ['./personal-account-daily-data-container.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonalAccountDailyDataContainerComponent implements OnInit {
	@Input() personalAccountBasic!: PersonalAccountOverviewFragment;
	weeklyIds$!: Observable<string[] | undefined>; // 2022-7-32, 2022-7-33, ...
	expenseAllocationChartData$!: Observable<GenericChartSeriesPie | null>;
	personalAccountDailyData$!: Observable<PersonalAccountDailyDataOutputFragment[]>;

	ChartType = ChartType;

	readonly filterControl = new FormControl<PersonalAccountFilterFormValues>(
		{
			year: -1,
			month: -1,
			week: -1,
		},
		{ nonNullable: true }
	);

	constructor(private personalAccountFacadeService: PersonalAccountFacadeService, private dialog: MatDialog) {}

	ngOnInit(): void {
		// set current month to form
		const { year, month } = DateServiceUtil.getDetailsInformationFromDate(new Date());
		this.filterControl.patchValue({ year, month, week: -1 }, { emitEvent: false });

		// select account overview by ID so we are notified by changes
		const accountDetails$ = this.personalAccountFacadeService.getPersonalAccountDetailsById(
			this.personalAccountBasic.id
		);

		// 2022-7-32, 2022-7-33, ...
		this.weeklyIds$ = accountDetails$.pipe(map((account) => account?.weeklyAggregaton.map((d) => d.id)));

		this.personalAccountDailyData$ = this.filterControl.valueChanges.pipe(
			startWith(this.filterControl.getRawValue()),
			switchMap((formResult) =>
				this.personalAccountFacadeService
					.getPersonalAccountDailyData({
						personalAccountId: this.personalAccountBasic.id,
						year: formResult.year ?? year,
						month: formResult.month ?? month,
					})
					.pipe(
						// filter out correct week if selected
						map((dailyDataArray) =>
							formResult.week === -1
								? dailyDataArray
								: dailyDataArray.filter((dailyData) => dailyData.week === formResult.week)
						)
					)
			)
		);

		// calculate expense chart for filtered data
		this.expenseAllocationChartData$ = this.personalAccountDailyData$.pipe(
			map((result) => (!!result ? this.formatToExpenseAllocationChartData(result) : null))
		);
	}

	onDailyEntryClick(editingDailyData: PersonalAccountDailyDataOutputFragment | null): void {
		this.dialog.open(PersonalAccountDailyDataEntryComponent, {
			data: {
				dailyData: editingDailyData,
				personalAccountId: this.personalAccountBasic.id,
				personalAccountName: this.personalAccountBasic.name,
			},
			panelClass: ['g-mat-dialog-big'],
		});
	}

	private formatToExpenseAllocationChartData(data: PersonalAccountDailyDataOutputFragment[]): GenericChartSeriesPie {
		const seriesData = data.reduce((acc, curr) => {
			// ignore income
			if (curr.personalAccountTag.type === TagDataType.Income) {
				return acc;
			}

			// find index of saved tag
			const dataIndex = acc.findIndex((d) => d.name === curr.personalAccountTag.name);
			if (dataIndex === -1) {
				acc = [...acc, { name: curr.personalAccountTag.name, y: curr.value }]; // new tag
			} else {
				acc[dataIndex].y += curr.value; // increase value for tag
			}

			return acc;
		}, [] as GenericChartSeriesData[]);

		return { data: seriesData, colorByPoint: true, name: 'Expenses', innerSize: '30%', type: 'pie' };
	}
}

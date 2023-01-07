import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { combineLatest, map, Observable, of, startWith, switchMap } from 'rxjs';
import { PersonalAccountFacadeService } from './../../../../core/api';
import {
	PersonalAccountDailyDataOutputFragment,
	PersonalAccountMonthlyDataDetailFragment,
	PersonalAccountOverviewFragment,
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
	weeklyIds$!: Observable<string[]>; // 2022-7-32, 2022-7-33, ...
	monthlyDataDetail$!: Observable<PersonalAccountMonthlyDataDetailFragment | null>;
	monthlyDataDetailAvailableWeeks$!: Observable<number>;
	monthlyDataDetailTable$!: Observable<PersonalAccountMonthlyDataDetailFragment | null>;
	expenseAllocationChartData$!: Observable<GenericChartSeriesPie | null>;

	ChartType = ChartType;

	private fb = inject(FormBuilder);
	readonly filterControl = this.fb.nonNullable.control({
		yearAndMonth: '',
		week: -1,
		tag: [] as string[],
	});

	constructor(private personalAccountFacadeService: PersonalAccountFacadeService, private dialog: MatDialog) {}

	ngOnInit(): void {
		// set current month to form
		const { year, month } = DateServiceUtil.getDetailsInformationFromDate(new Date());
		this.filterControl.patchValue({ yearAndMonth: `${year}-${month}`, tag: [], week: -1 }, { emitEvent: false });

		// select account overview by ID so we are notified by changes
		const accountDetails$ = this.personalAccountFacadeService.getPersonalAccountDetailsById(
			this.personalAccountBasic.id
		);

		// 2022-7-32, 2022-7-33, ...
		this.weeklyIds$ = accountDetails$.pipe(map((account) => account.weeklyAggregaton.map((d) => d.id)));

		// load / filter date based on filter change
		this.monthlyDataDetail$ = combineLatest([
			this.filterControl.valueChanges.pipe(startWith(this.filterControl.getRawValue())),
			accountDetails$,
		]).pipe(
			switchMap(([filterValues, account]) => {
				const [year, month] = filterValues.yearAndMonth.split('-').map((d) => Number(d));
				const monthlyDataOverview = account.monthlyData.find((d) => d.year === year && d.month === month);
				// new month/year - no data was yet created
				if (!monthlyDataOverview) {
					return of(null);
				}
				// TODO this is triggered 3x , why ?
				console.log('monthlyData', filterValues);
				return this.personalAccountFacadeService.getPersonalAccountMonthlyDataById(monthlyDataOverview.id);
			})
		);

		this.monthlyDataDetailTable$ = this.monthlyDataDetail$.pipe(
			map((monthlyDataDetails) => {
				if (!monthlyDataDetails) {
					return null;
				}

				const selectedTagIds = this.filterControl.getRawValue().tag;
				const selectedWeek = this.filterControl.getRawValue().week;

				const filteredDailyData = monthlyDataDetails.dailyExpenses.filter((d) => {
					if (selectedTagIds.length !== 0 && !selectedTagIds.includes(d.tagId)) {
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

	private formatToExpenseAllocationChartData(data: PersonalAccountMonthlyDataDetailFragment): GenericChartSeriesPie {
		const seriesData = data.dailyExpenses.reduce((acc, curr) => {
			// find index of saved tag
			const dataIndex = acc.findIndex((d) => d.name === curr.personalAccountTag.name);
			if (dataIndex === -1) {
				acc = [...acc, { name: curr.personalAccountTag.name, y: curr.value }]; // new tag
			} else {
				acc[dataIndex].y += curr.value; // increase value for tag
			}

			return acc;
		}, [] as GenericChartSeriesData[]);

		return { data: seriesData, colorByPoint: true, name: 'Expenses', innerSize: '30%' };
	}
}

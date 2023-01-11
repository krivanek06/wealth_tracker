import { ChangeDetectionStrategy, Component, Directive, inject, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { map, Observable, startWith, switchMap } from 'rxjs';
import { PersonalAccountFilterFormValues } from '../../models';
import { PersonalAccountChartService } from '../../services';
import { PersonalAccountFacadeService } from './../../../../core/api';
import { PersonalAccountDailyDataOutputFragment, PersonalAccountOverviewFragment } from './../../../../core/graphql';
import { ChartType, GenericChartSeriesPie } from './../../../../shared/models';
import { DateServiceUtil } from './../../../../shared/utils';
import { PersonalAccountDailyDataEntryComponent } from './../../modals';

@Directive({
	standalone: true,
})
export class DailyDataAggregator implements OnInit {
	@Input() personalAccountBasic!: PersonalAccountOverviewFragment;

	readonly filterControl = new FormControl<PersonalAccountFilterFormValues>(
		{
			year: -1,
			month: -1,
			week: -1,
		},
		{ nonNullable: true }
	);

	/**
	 * format: 2022-7-32, 2022-7-33, ...
	 */
	weeklyIds$!: Observable<string[] | undefined>;

	/**
	 * Daily data transformed into expense allocation chart
	 */
	expenseAllocationChartData$!: Observable<GenericChartSeriesPie | null>;

	/**
	 * daily data based on select date interval
	 */
	personalAccountDailyData$!: Observable<PersonalAccountDailyDataOutputFragment[]>;

	personalAccountFacadeService = inject(PersonalAccountFacadeService);
	personalAccountChartService = inject(PersonalAccountChartService);

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
			map((result) => (!!result ? this.personalAccountChartService.getExpenseAllocationChartData(result) : null))
		);
	}
}

@Component({
	selector: 'app-personal-account-daily-data-container',
	templateUrl: './personal-account-daily-data-container.component.html',
	styleUrls: ['./personal-account-daily-data-container.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	// standalone: true,
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

	constructor(
		private personalAccountFacadeService: PersonalAccountFacadeService,
		private personalAccountChartService: PersonalAccountChartService,
		private dialog: MatDialog
	) {}

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
			map((result) => (!!result ? this.personalAccountChartService.getExpenseAllocationChartData(result) : null))
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
}

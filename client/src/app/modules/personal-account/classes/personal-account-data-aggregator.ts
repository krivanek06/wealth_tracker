import { Directive, inject, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { map, Observable, startWith, switchMap } from 'rxjs';
import { PersonalAccountFacadeService } from '../../../core/api';
import { PersonalAccountDailyDataOutputFragment, PersonalAccountOverviewFragment } from '../../../core/graphql';
import { ChartType, GenericChartSeriesPie } from '../../../shared/models';
import { DateServiceUtil } from '../../../shared/utils';
import { PersonalAccountFilterFormValues } from '../models';
import { PersonalAccountChartService } from '../services';

@Directive({
	standalone: true,
})
export class PersonalAccountDailyDataAggregator implements OnInit {
	@Input() personalAccountBasic!: PersonalAccountOverviewFragment;

	readonly filterControl = new FormControl<PersonalAccountFilterFormValues>(
		{
			year: -1,
			month: -1,
			week: -1,
		},
		{ nonNullable: true }
	);

	ChartType = ChartType;

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

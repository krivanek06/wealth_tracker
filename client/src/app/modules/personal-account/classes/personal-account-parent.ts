import { Directive, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { computedFrom } from 'ngxtension/computed-from';
import { of, pipe, startWith, switchMap } from 'rxjs';
import { PersonalAccountDailyDataNew, PersonalAccountService } from '../../../core/api';
import { dateSplitter, getDetailsInformationFromDate } from '../../../core/utils';
import { SCREEN_DIALOGS } from '../../../shared/models';
import { PersonalAccountDailyDataEntryComponent, PersonalAccountTagManagerModalComponent } from '../modals';
import { NO_DATE_SELECTED, PersonalAccountActionButtonType, PersonalAccountTagAggregationType } from '../models';
import { PersonalAccountChartService, PersonalAccountDataService } from '../services';
@Directive()
export abstract class PersonalAccountParent {
	protected personalAccountService = inject(PersonalAccountService);
	protected personalAccountChartService = inject(PersonalAccountChartService);
	protected personalAccountDataService = inject(PersonalAccountDataService);
	protected dialog = inject(MatDialog);

	/**
	 * form used to filter daily data
	 */
	private today = getDetailsInformationFromDate();

	readonly filterDailyDataGroup = new FormGroup({
		// selected month - format year-month-week, week is optional
		dateFilter: new FormControl<string>(this.today.currentDateMonth, { nonNullable: true }),
		// keeps track of visible tags, if empty -> all is visible
		selectedTagIds: new FormControl<string[]>([], { nonNullable: true }),
	});

	personalAccountSignal = this.personalAccountService.personalAccountSignal;
	weeklyAggregations = this.personalAccountService.weeklyAggregatedSignal;

	dateSource = toSignal(
		this.filterDailyDataGroup.controls.dateFilter.valueChanges.pipe(
			startWith(this.filterDailyDataGroup.controls.dateFilter.value)
		),
		{ initialValue: this.today.currentDateMonth }
	);

	//personalAccountDetails$!: Observable<PersonalAccountDetailsFragment>;

	yearlyExpenseTags = computed(() => {
		const data = this.personalAccountService
			.yearlyAggregatedSignal()
			.filter((d) => d.tag.type === 'EXPENSE' && d.value > 0);
		return this.personalAccountDataService.createValuePresentItemFromTag(data);
	});

	/**
	 * current account state totalIncome, totalExpense and difference
	 */
	accountTotalState = computed(() =>
		this.personalAccountChartService.getAccountState(this.personalAccountService.yearlyAggregatedSignal())
	);

	/**
	 * growth chart by selected expenses
	 */
	accountOverviewChartData = computed(() => {
		const activeTagIds = this.selectedTagIds();
		const weeklyAggregations = this.personalAccountService.weeklyAggregatedSignal();

		const chart1 = this.personalAccountChartService.getAccountGrowthChartData(weeklyAggregations, activeTagIds);
		const chart2 = this.personalAccountChartService.getAccountIncomeExpenseChartData(weeklyAggregations, activeTagIds);

		const result = [chart1, ...chart2];
		return result;
	});

	/**
	 * all daily data for a period
	 */
	totalDailyDataForTimePeriod = computedFrom(
		[this.personalAccountService.personalAccountMonthlyDataSignal, this.dateSource],
		pipe(
			switchMap(([monthlyData, dateFilter]) => {
				if (dateFilter === NO_DATE_SELECTED || !monthlyData) {
					return of([]);
				}

				const [year, month, week] = dateSplitter(dateFilter);

				const monthlyDataForTimePeriod = monthlyData.find((d) => d.year === year && d.month === month);
				const dailyData = monthlyDataForTimePeriod?.dailyData ?? [];

				if (!week) {
					return of(dailyData);
				}

				const weeklyData = dailyData.filter((d) => d.week === week);
				return of(weeklyData);
			})
		)
	);

	/**
	 * account state by selected date interval and tags
	 */
	accountFilteredState = computed(() => {
		const dailyData = this.totalDailyDataForTimePeriod();
		const tags = this.personalAccountService.personalAccountTagsSignal();
		return this.personalAccountChartService.getAccountStateByDailyData(dailyData, tags);
	});

	/**
	 * chart data for selected expenses
	 */
	totalExpenseTagsChartData = computed(() => {
		const activeTagIds = this.selectedTagIds();
		const weeklyAggregations = this.personalAccountService.weeklyAggregatedSignal();
		const availableExpenseTags = this.personalAccountService.personalAccountTagsExpenseSignal();
		return this.personalAccountChartService.getWeeklyExpenseChartData(
			weeklyAggregations,
			availableExpenseTags,
			activeTagIds
		);
	});

	/**
	 * chart categories for X-axis, example: Week 40. Sep
	 */
	categories = computed(() =>
		this.personalAccountChartService.getChartCategories(this.personalAccountService.weeklyAggregatedSignal())
	);

	/**
	 * daily data based on select date interval and tags
	 */
	filteredDailyData = computed(() => {
		const data = this.totalDailyDataForTimePeriod();
		const tags = this.selectedTagIds();
		if (!tags || tags.length === 0) {
			return data;
		}

		return data.filter((d) => tags.includes(d.tagId));
	});

	/**
	 * Expense allocation chart
	 */
	personalAccountExpensePieChart = computed(() => {
		const data = this.totalDailyDataForTimePeriod();
		const yearlyAggregation = this.personalAccountService.yearlyAggregatedSignal();

		const personalAccountDailyExpensePieChart = this.personalAccountChartService.getExpenseAllocationChartData(data);
		const personalAccountYearlyTagExpensePieChart =
			this.personalAccountChartService.getExpenseAllocationChartData(yearlyAggregation);

		return this.dateSource() === NO_DATE_SELECTED
			? personalAccountYearlyTagExpensePieChart
			: personalAccountDailyExpensePieChart;
	});

	/**
	 * Aggregating daily data by distinct tag for a time period (month/week)
	 */
	accountTagAggregationForTimePeriod = computed(() => {
		const yearlyAggregation = this.personalAccountService.yearlyAggregatedSignal();
		const dailyData = this.totalDailyDataForTimePeriod();

		const data =
			this.dateSource() === NO_DATE_SELECTED
				? this.personalAccountDataService.getPersonalAccountTagAggregationByAggregationData(yearlyAggregation)
				: this.personalAccountDataService.getPersonalAccountTagAggregationByDailyData(dailyData, this.dateSource());

		// sort DESC by total value
		const dataSorted = data.sort((a, b) => b.totalValue - a.totalValue);

		// group by income and expenses
		const dataGrouped = dataSorted.reduce(
			(acc, curr) =>
				curr.type === 'INCOME'
					? { ...acc, incomes: [...acc.incomes, curr] }
					: { ...acc, expenses: [...acc.expenses, curr] },
			{
				incomes: [],
				expenses: [],
			} as PersonalAccountTagAggregationType
		);

		return dataGrouped;
	});

	isDateSourceNoDate = computed(() => this.dateSource() === NO_DATE_SELECTED);

	selectedTagIds = toSignal(
		this.filterDailyDataGroup.controls.selectedTagIds.valueChanges.pipe(
			startWith(this.filterDailyDataGroup.controls.selectedTagIds.value)
		)
	);

	onDailyEntryClick(editingDailyData: PersonalAccountDailyDataNew | null): void {
		this.dialog.open(PersonalAccountDailyDataEntryComponent, {
			data: {
				dailyData: editingDailyData,
			},
			panelClass: [SCREEN_DIALOGS.DIALOG_SMALL],
		});
	}

	onActionButtonClick(type: PersonalAccountActionButtonType): void {
		this.dialog.open(PersonalAccountTagManagerModalComponent, {
			panelClass: [SCREEN_DIALOGS.DIALOG_BIG],
		});
	}
}

import { Directive, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { getWeek } from 'date-fns';
import { startWith } from 'rxjs';
import { PersonalAccountDailyData, PersonalAccountService, PersonalAccountTag } from '../../../core/api';
import { dateSplitter, getDetailsInformationFromDate } from '../../../core/utils';
import { SCREEN_DIALOGS, ValuePresentItem } from '../../../shared/models';
import { PersonalAccountDailyDataEntryComponent } from '../modals';
import { PersonalAccountChartService } from '../services';
import {
	NO_DATE_SELECTED,
	PersonalAccountAggregatorService,
	PersonalAccountTagAggregationType,
} from './../../../core/api';
@Directive()
export abstract class PersonalAccountParent {
	protected personalAccountService = inject(PersonalAccountService);
	protected personalAccountChartService = inject(PersonalAccountChartService);
	protected personalAccountAggregatorService = inject(PersonalAccountAggregatorService);
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

	yearlyExpenseTags = computed(() => {
		const data = this.personalAccountService
			.yearlyAggregatedSignal()
			.filter((d) => d.tag.type === 'EXPENSE' && d.value > 0);

		const totalValue = data.reduce((a, b) => a + b.value, 0);

		return data.map((d) => {
			const data: ValuePresentItem<PersonalAccountTag> = {
				color: d.tag.color,
				imageSrc: d.tag.image,
				imageType: 'tagName',
				name: d.tag.name,
				value: d.value,
				valuePrct: d.value / totalValue,
				item: d.tag,
			};

			return data;
		});
	});

	/**
	 * current account state totalIncome, totalExpense and difference
	 */
	accountTotalState = computed(() =>
		this.personalAccountAggregatorService.getAccountState(this.personalAccountService.yearlyAggregatedSignal())
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
	totalDailyDataForTimePeriod = computed(() => {
		const allMonthlyData = this.personalAccountService.personalAccountMonthlyDataSignal();
		const selectedData = this.dateSource();

		if (selectedData === NO_DATE_SELECTED || !allMonthlyData) {
			return [];
		}

		const [year, month, week] = dateSplitter(selectedData);
		// format date, make 2022-1-1 to be 2022-01
		const correctKey = month < 10 ? `${year}-0${month}` : `${year}-${month}`;

		const monthlyDataForTimePeriod = allMonthlyData.find((d) => d.id === correctKey);
		const dailyData = monthlyDataForTimePeriod?.dailyData ?? [];

		// no week selected, return all daily data for a month
		if (!week) {
			return dailyData;
		}

		// filter daily data by week
		const weeklyData = dailyData.filter((d) => getWeek(d.date) === week);
		return weeklyData;
	});

	/**
	 * account state by selected date interval and tags
	 */
	accountFilteredState = computed(() => {
		const dailyData = this.totalDailyDataForTimePeriod();
		const tags = this.personalAccountService.personalAccountTagsSignal();
		return this.personalAccountAggregatorService.getAccountStateByDailyData(dailyData, tags);
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
				? this.personalAccountAggregatorService.getPersonalAccountTagAggregationByAggregationData(yearlyAggregation)
				: this.personalAccountAggregatorService.getPersonalAccountTagAggregationByDailyData(
						dailyData,
						this.dateSource()
					);

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

	onDailyEntryClick(editingDailyData: PersonalAccountDailyData | null): void {
		this.dialog.open(PersonalAccountDailyDataEntryComponent, {
			data: {
				dailyData: editingDailyData,
			},
			panelClass: [SCREEN_DIALOGS.DIALOG_SMALL],
		});
	}
}

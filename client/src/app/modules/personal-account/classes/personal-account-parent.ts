import { ChangeDetectorRef, Directive, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { computedFrom } from 'ngxtension/computed-from';
import { of, pipe, startWith, switchMap } from 'rxjs';
import { PersonalAccountDailyDataNew, PersonalAccountService } from '../../../core/api';
import { DateServiceUtil } from '../../../core/utils';
import { ChartType } from '../../../shared/models';
import { PersonalAccountDailyDataEntryComponent, PersonalAccountTagManagerModalComponent } from '../modals';
import { NO_DATE_SELECTED, PersonalAccountActionButtonType, PersonalAccountTagAggregationType } from '../models';
import { PersonalAccountChartService, PersonalAccountDataService } from '../services';
@Directive()
export abstract class PersonalAccountParent {
	protected personalAccountService = inject(PersonalAccountService);
	protected personalAccountChartService = inject(PersonalAccountChartService);
	protected personalAccountDataService = inject(PersonalAccountDataService);
	protected dialog = inject(MatDialog);
	protected cd = inject(ChangeDetectorRef);

	/**
	 * form used to filter daily data
	 */
	private today = DateServiceUtil.getDetailsInformationFromDate(new Date());
	readonly filterDailyDataGroup = new FormGroup({
		// selected month - format year-month-week, week is optional
		dateFilter: new FormControl<string>(`${this.today.year}-${this.today.month}`, { nonNullable: true }),
		// keeps track of visible tags, if empty -> all is visible
		selectedTagIds: new FormControl<string[]>([], { nonNullable: true }),
	});

	personalAccountSignal = this.personalAccountService.personalAccountSignal;
	weeklyAggregations = this.personalAccountService.weeklyAggregatedSignal;

	dateSource = toSignal(
		this.filterDailyDataGroup.controls.dateFilter.valueChanges.pipe(
			startWith(this.filterDailyDataGroup.controls.dateFilter.value)
		),
		{ initialValue: `${this.today.year}-${this.today.month}` }
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
				const { year, month, week } = DateServiceUtil.getDetailsInformationFromDate(dateFilter);
				const monthlyDataForTimePeriod = monthlyData.filter((d) => d.year === year && d.month === month);
				return of(monthlyDataForTimePeriod.length === 0 ? [] : monthlyDataForTimePeriod[0].dailyData);
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
		return !!tags ? data.filter((d) => tags.includes(d.tagId)) : [];
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

	//personalAccountBasic!: AccountIdentification;

	ChartType = ChartType;

	// get dateSource() {
	// 	return this.filterDailyDataGroup.controls.dateFilter.value;
	// }

	// get isDateSourceNoDate() {
	// 	return this.dateSource === NO_DATE_SELECTED;
	// }

	isDateSourceNoDate = computed(() => this.dateSource() === NO_DATE_SELECTED);

	selectedTagIds = toSignal(
		this.filterDailyDataGroup.controls.selectedTagIds.valueChanges.pipe(
			startWith(this.filterDailyDataGroup.controls.selectedTagIds.value)
		)
	);

	private initData(): void {
		//this.personalAccountDetails$ = this.personalAccountFacadeService.getPersonalAccountDetailsByUser();
		// calculate account state - balance, cash, invested
		// this.accountTotalState$ = this.personalAccountDetails$.pipe(
		// 	map((account) => this.personalAccountChartService.getAccountState(account.yearlyAggregation))
		// );
		// filter out expense tags to show them to the user
		// this.yearlyExpenseTags$ = this.personalAccountDetails$.pipe(
		// 	map((account) => account.yearlyAggregation.filter((d) => d.tag.type === TagDataType.Expense && d.value > 0)),
		// 	map((expenseTags) => this.personalAccountDataService.createValuePresentItemFromTag(expenseTags))
		// );
		// get chart categories displayed on X-axis
		// this.categories$ = this.personalAccountDetails$.pipe(
		// 	map((account) => this.personalAccountChartService.getChartCategories(account))
		// );
		// construct expense chart by the selected expenses tags
		// this.totalExpenseTagsChartData$ = combineLatest([
		// 	// selected expenses
		// 	this.selectedTagIds$,
		// 	// account
		// 	this.personalAccountDetails$,
		// 	// passing all available expense tags to create chart
		// 	this.yearlyExpenseTags$.pipe(map((yearlyExpenseTags) => yearlyExpenseTags.map((d) => d.item))),
		// ]).pipe(
		// 	map(([activeTagIds, account, availableExpenseTags]) =>
		// 		this.personalAccountChartService.getWeeklyExpenseChartData(account, availableExpenseTags, activeTagIds)
		// 	)
		// );
		// // construct account overview vy the selected expense tags
		// this.accountOverviewChartData$ = combineLatest([
		// 	// selected expenses
		// 	this.selectedTagIds$,
		// 	// account
		// 	this.personalAccountDetails$,
		// ]).pipe(
		// 	switchMap(([activeTagIds, account]) =>
		// 		merge(
		// 			[this.personalAccountChartService.getAccountGrowthChartData(account, activeTagIds)],
		// 			this.personalAccountChartService.getAccountIncomeExpenseChartData(account, activeTagIds)
		// 		).pipe(reduce((acc, curr) => [...acc, curr], [] as GenericChartSeries[]))
		// 	)
		// );
		// all daily data for a period
		// const totalDailyDataForTimePeriod$ = this.dateSource$.pipe(
		// 	tap(() => this.filteredDailyDataLoaded$.next(false)),
		// 	switchMap((dateFilter) =>
		// 		dateFilter === NO_DATE_SELECTED
		// 			? of([])
		// 			: this.personalAccountFacadeService.getPersonalAccountDailyData(dateFilter)
		// 	),
		// 	tap(() => this.filteredDailyDataLoaded$.next(true)),
		// 	// prevent multiple triggers
		// 	shareReplay({ bufferSize: 1, refCount: true })
		// );
		// this.accountFilteredState$ = totalDailyDataForTimePeriod$.pipe(
		// 	map((dailyData) => this.personalAccountChartService.getAccountStateByDailyData(dailyData))
		// );
		// daily data displayed on UI - filtered by selected tag ids
		// this.filteredDailyData$ = combineLatest([totalDailyDataForTimePeriod$, this.selectedTagIds$]).pipe(
		// 	map(([totalDailyData, selectedTagIds]) => {
		// 		// no tag id is selected
		// 		if (selectedTagIds.length === 0) {
		// 			return totalDailyData;
		// 		}
		// 		// filter by selected tag id
		// 		return totalDailyData.filter((d) => selectedTagIds.includes(d.tagId));
		// 	})
		// );
		// calculate expense chart for filtered data
		// const personalAccountDailyExpensePieChart$ = totalDailyDataForTimePeriod$.pipe(
		// 	map((result) => (!!result ? this.personalAccountChartService.getExpenseAllocationChartData(result) : null))
		// );
		// const personalAccountYearlyTagExpensePieChart$ = this.personalAccountDetails$.pipe(
		// 	map((result) => this.personalAccountChartService.getExpenseAllocationChartData(result.yearlyAggregation))
		// );
		// this.personalAccountExpensePieChart$ = this.dateSource$.pipe(
		// 	mergeMap((dateSource) =>
		// 		iif(
		// 			() => dateSource === NO_DATE_SELECTED,
		// 			personalAccountYearlyTagExpensePieChart$,
		// 			personalAccountDailyExpensePieChart$
		// 		)
		// 	)
		// );
		// this.accountTagAggregationForTimePeriod$ = combineLatest([
		// 	totalDailyDataForTimePeriod$,
		// 	this.personalAccountDetails$,
		// ]).pipe(
		// 	tap(console.log),
		// 	map(([result, details]: [PersonalAccountDailyDataOutputFragment[], PersonalAccountDetailsFragment]) =>
		// 		this.dateSource === NO_DATE_SELECTED
		// 			? this.personalAccountDataService.getPersonalAccountTagAggregationByAggregationData(details.yearlyAggregation)
		// 			: this.personalAccountDataService.getPersonalAccountTagAggregationByDailyData(result, this.dateSource)
		// 	),
		// 	// sort DESC by total value
		// 	map((result) => result.sort((a, b) => b.totalValue - a.totalValue)),
		// 	// group by income and expenses
		// 	map((result) =>
		// 		result.reduce(
		// 			(acc, curr) =>
		// 				curr.type === TagDataType.Income
		// 					? { ...acc, incomes: [...acc.incomes, curr] }
		// 					: { ...acc, expenses: [...acc.expenses, curr] },
		// 			{
		// 				incomes: [],
		// 				expenses: [],
		// 			} as PersonalAccountTagAggregationType
		// 		)
		// 	),
		// 	shareReplay({ bufferSize: 1, refCount: true })
		// );
	}

	onDailyEntryClick(editingDailyData: PersonalAccountDailyDataNew | null): void {
		this.dialog.open(PersonalAccountDailyDataEntryComponent, {
			data: {
				dailyData: editingDailyData,
			},
			panelClass: ['g-mat-dialog-small'],
		});
	}

	onActionButtonClick(type: PersonalAccountActionButtonType): void {
		this.dialog.open(PersonalAccountTagManagerModalComponent, {
			panelClass: ['g-mat-dialog-big'],
		});
	}
}

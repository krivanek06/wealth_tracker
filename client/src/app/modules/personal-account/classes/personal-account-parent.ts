import { Directive, inject, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { combineLatest, map, merge, Observable, of, reduce, startWith, switchMap, tap } from 'rxjs';
import { PersonalAccountFacadeService } from '../../../core/api';
import {
	AccountIdentification,
	PersonalAccountDailyDataOutputFragment,
	PersonalAccountDetailsFragment,
	PersonalAccountTagFragment,
	TagDataType,
} from '../../../core/graphql';
import { DateServiceUtil } from '../../../core/utils';
import {
	ChartType,
	GenericChartSeries,
	GenericChartSeriesPie,
	InputSourceWrapper,
	ValuePresentItem,
} from '../../../shared/models';
import { PersonalAccountDailyDataEntryComponent } from '../modals';
import { AccountState, NO_DATE_SELECTED, PersonalAccountTagAggregation } from '../models';
import { PersonalAccountChartService, PersonalAccountDataService } from '../services';

@Directive()
export abstract class PersonalAccountParent {
	@Input() set accountIdentification(data: AccountIdentification | undefined | null) {
		if (!data) {
			return;
		}
		this.personalAccountBasic = data;
		this.initData(data);
	}

	personalAccountDetails$!: Observable<PersonalAccountDetailsFragment>;

	yearlyExpenseTags$!: Observable<ValuePresentItem<PersonalAccountTagFragment>[]>;

	/**
	 * current account state totalIncome, totalExpense and difference
	 */
	accountTotalState$!: Observable<AccountState>;
	accountFilteredState$!: Observable<AccountState>;

	/**
	 * growth chart by selected expenses
	 */
	accountOverviewChartData$!: Observable<GenericChartSeries[]>;

	/**
	 * expense chart by the selected expenses tags
	 */
	totalExpenseTagsChartData$!: Observable<GenericChartSeries[]>;

	/**
	 * chart categories for X-axis, example: Week 40. Sep
	 */
	categories$!: Observable<string[]>;

	/**
	 * values to filter daily data based on some date (year-month-week)
	 */
	filterDateInputSourceWrapper$!: Observable<InputSourceWrapper[]>;

	/**
	 * daily data based on select date interval and tags
	 */
	filteredDailyData$!: Observable<PersonalAccountDailyDataOutputFragment[]>;

	/**
	 * Daily data transformed into expense allocation chart
	 */
	personalAccountDailyExpensePieChart$!: Observable<GenericChartSeriesPie | null>;
	/**
	 * yearly data transformed into expense allocation chart
	 */
	personalAccountYearlyTagExpensePieChart$!: Observable<GenericChartSeriesPie | null>;

	/**
	 * Aggregating daily data by distinct tag for a time period (month/week)
	 */
	accountTagAggregationForTimePeriod$!: Observable<PersonalAccountTagAggregation[]>;

	/**
	 * form used to filter daily data
	 */
	today = DateServiceUtil.getDetailsInformationFromDate(new Date());
	readonly filterDailyDataGroup = new FormGroup({
		// selected month - format year-month-week, week is optional
		dateFilter: new FormControl<string>(`${this.today.year}-${this.today.month}`, { nonNullable: true }),
		// keeps track of visible tags, if empty -> all is visible
		selectedTagIds: new FormControl<string[]>([], { nonNullable: true }),
	});

	personalAccountBasic!: AccountIdentification;

	personalAccountFacadeService = inject(PersonalAccountFacadeService);
	personalAccountChartService = inject(PersonalAccountChartService);
	personalAccountDataService = inject(PersonalAccountDataService);
	dialog = inject(MatDialog);

	ChartType = ChartType;

	get dateSource$() {
		return this.filterDailyDataGroup.controls.dateFilter.valueChanges.pipe(
			startWith(this.filterDailyDataGroup.controls.dateFilter.value)
		);
	}

	get selectedTagIds$() {
		return this.filterDailyDataGroup.controls.selectedTagIds.valueChanges.pipe(
			startWith(this.filterDailyDataGroup.controls.selectedTagIds.value)
		);
	}

	constructor() {}

	private initData(account: AccountIdentification): void {
		this.personalAccountDetails$ = this.personalAccountFacadeService.getPersonalAccountDetailsById(account.id);

		// get dates that we can filter by
		this.filterDateInputSourceWrapper$ = this.personalAccountDetails$.pipe(
			map((data) => this.personalAccountDataService.getMonthlyInputSource(data.weeklyAggregaton))
		);

		// calculate account state - balance, cash, invested
		this.accountTotalState$ = this.personalAccountDetails$.pipe(
			map((account) => this.personalAccountChartService.getAccountState(account.yearlyAggregaton))
		);

		// filter out expense tags to show them to the user
		this.yearlyExpenseTags$ = this.personalAccountDetails$.pipe(
			map((account) => account.yearlyAggregaton.filter((d) => d.tag.type === TagDataType.Expense)),
			map((expenseTags) => this.personalAccountDataService.createValuePresentItemFromTag(expenseTags))
		);

		// get chart categories displayed on X-axis
		this.categories$ = this.personalAccountDetails$.pipe(
			map((account) => this.personalAccountChartService.getChartCategories(account))
		);

		// construct expense chart by the selected expenses tags
		this.totalExpenseTagsChartData$ = combineLatest([
			// selected expenses
			this.selectedTagIds$,
			// account
			this.personalAccountDetails$,
			// passing all available expense tags to create chart
			this.yearlyExpenseTags$.pipe(map((yearlyExpenseTags) => yearlyExpenseTags.map((d) => d.item))),
		]).pipe(
			map(([activeTagIds, account, availableExpenseTags]) =>
				this.personalAccountChartService.getWeeklyExpenseChartData(account, 'week', availableExpenseTags, activeTagIds)
			)
		);

		// construct account overview vy the selected expense tags
		this.accountOverviewChartData$ = combineLatest([
			// selected expenses
			this.selectedTagIds$,
			// account
			this.personalAccountDetails$,
		]).pipe(
			switchMap(([activeTagIds, account]) =>
				merge(
					[this.personalAccountChartService.getAccountGrowthChartData(account, 'week', activeTagIds)],
					this.personalAccountChartService.getAccountIncomeExpenseChartData(account, 'week', activeTagIds)
				).pipe(reduce((acc, curr) => [...acc, curr], [] as GenericChartSeries[]))
			)
		);

		// all daily data for a period
		const totalDailyDataForTimePeriod$ = this.dateSource$.pipe(
			switchMap((dateFilter) =>
				dateFilter === NO_DATE_SELECTED
					? of([])
					: this.personalAccountFacadeService.getPersonalAccountDailyData(this.personalAccountBasic.id, dateFilter)
			)
		);

		this.accountFilteredState$ = totalDailyDataForTimePeriod$.pipe(
			map((dailyData) => this.personalAccountChartService.getAccountStateByDailyData(dailyData))
		);

		// daily data displayed on UI - filtered by selected tag ids
		this.filteredDailyData$ = combineLatest([totalDailyDataForTimePeriod$, this.selectedTagIds$]).pipe(
			map(([totalDailyData, selectedTagIds]) => {
				// no tag id is selected
				if (selectedTagIds.length === 0) {
					return totalDailyData;
				}

				// filter by selected tag id
				return totalDailyData.filter((d) => selectedTagIds.includes(d.tagId));
			})
		);

		// calculate expense chart for filtered data
		this.personalAccountDailyExpensePieChart$ = totalDailyDataForTimePeriod$.pipe(
			map((result) => (!!result ? this.personalAccountChartService.getExpenseAllocationChartData(result) : null))
		);
		this.personalAccountYearlyTagExpensePieChart$ = this.personalAccountDetails$.pipe(
			map((result) => this.personalAccountChartService.getExpenseAllocationChartData(result.yearlyAggregaton))
		);

		this.accountTagAggregationForTimePeriod$ = combineLatest([
			totalDailyDataForTimePeriod$,
			this.dateSource$,
			this.personalAccountDetails$,
		]).pipe(
			tap(console.log),
			map(
				([result, dateFilter, details]: [
					PersonalAccountDailyDataOutputFragment[],
					string,
					PersonalAccountDetailsFragment
				]) =>
					dateFilter === NO_DATE_SELECTED
						? this.personalAccountDataService.getPersonalAccountTagAggregationByAggregationData(
								details.yearlyAggregaton
						  )
						: this.personalAccountDataService.getPersonalAccountTagAggregationByDailyData(result)
			)
		);

		this.accountTagAggregationForTimePeriod$.subscribe((d) => console.log('watch me', d));
	}

	onDailyEntryClick(editingDailyData: PersonalAccountDailyDataOutputFragment | null): void {
		this.dialog.open(PersonalAccountDailyDataEntryComponent, {
			data: {
				dailyData: editingDailyData,
				personalAccountId: this.personalAccountBasic.id,
				personalAccountName: this.personalAccountBasic.name,
			},
			panelClass: ['g-mat-dialog-small'],
		});
	}
}

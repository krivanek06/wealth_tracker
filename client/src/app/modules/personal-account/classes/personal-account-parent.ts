import { Directive, inject, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { combineLatest, map, merge, Observable, reduce, startWith, switchMap } from 'rxjs';
import { PersonalAccountFacadeService } from '../../../core/api';
import {
	AccountIdentification,
	PersonalAccountDailyDataOutputFragment,
	PersonalAccountDetailsFragment,
	PersonalAccountTagFragment,
	TagDataType,
} from '../../../core/graphql';
import {
	ChartType,
	GenericChartSeries,
	GenericChartSeriesPie,
	InputSourceWrapper,
	ValuePresentItem,
} from '../../../shared/models';
import { DateServiceUtil } from '../../../shared/utils';
import { PersonalAccountDailyDataEntryComponent } from '../modals';
import { AccountState, PersonalAccountTagAggregation } from '../models';
import { PersonalAccountChartService, PersonalAccountDataService } from '../services';

@Directive()
export abstract class PersonalAccountParent {
	@Input() set accountIdentification(data: AccountIdentification) {
		this.personalAccountBasic = data;
		this.initData(data);
	}

	personalAccountDetails$!: Observable<PersonalAccountDetailsFragment>;

	yearlyExpenseTags$!: Observable<ValuePresentItem<PersonalAccountTagFragment>[]>;

	/**
	 * current account state totalIncome, totalExpense and difference
	 */
	accountState$!: Observable<AccountState>;

	/**
	 * growth chart by selected expenses
	 */
	accountOverviewChartData$!: Observable<GenericChartSeries[]>;

	/**
	 * expense chart by the selected expenses tags
	 */
	expenseTagsChartData$!: Observable<GenericChartSeries[]>;

	/**
	 * chart categories for X-axis, example: Week 40. Sep
	 */
	categories$!: Observable<string[]>;

	/**
	 * values to filter daily data based on some date (year-month-week)
	 */
	filterDateInputSourceWrapper$!: Observable<InputSourceWrapper[]>;

	/**
	 * daily data based on select date interval
	 */
	personalAccountDailyData$!: Observable<PersonalAccountDailyDataOutputFragment[]>;

	/**
	 * Daily data transformed into expense allocation chart
	 */
	personalAccountDailyExpensePieChart$!: Observable<GenericChartSeriesPie | null>;

	/**
	 * Aggregating daily data by distinct tag for a time period (month/week)
	 */
	accountTagAggregationForTimePeriod$!: Observable<PersonalAccountTagAggregation[]>;

	/**
	 * form used to filter daily data
	 */
	today = DateServiceUtil.getDetailsInformationFromDate(new Date());
	readonly filterDailyDataGroup = new FormGroup({
		dateFilter: new FormControl<string>(`${this.today.year}-${this.today.month}`, { nonNullable: true }),
	});

	// keeps track of visible tags, if empty -> all is visible
	readonly expenseFormControl = new FormControl<PersonalAccountTagFragment[]>([], { nonNullable: true });

	personalAccountBasic!: AccountIdentification;

	personalAccountFacadeService = inject(PersonalAccountFacadeService);
	personalAccountChartService = inject(PersonalAccountChartService);
	personalAccountDataService = inject(PersonalAccountDataService);
	dialog = inject(MatDialog);

	ChartType = ChartType;

	constructor() {}

	private initData(account: AccountIdentification): void {
		this.personalAccountDetails$ = this.personalAccountFacadeService.getPersonalAccountDetailsById(account.id);

		// get dates that we can filter by
		this.filterDateInputSourceWrapper$ = this.personalAccountDetails$.pipe(
			map((data) => this.personalAccountDataService.getMonthlyInputSource(data.weeklyAggregaton))
		);

		// calculate account state - balance, cash, invested
		this.accountState$ = this.personalAccountDetails$.pipe(
			map((account) => this.personalAccountChartService.getAccountState(account))
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
		this.expenseTagsChartData$ = combineLatest([
			// selected expenses
			this.expenseFormControl.valueChanges.pipe(startWith(this.expenseFormControl.value)),
			// account
			this.personalAccountDetails$,
			// passing all available expense tags to create chart
			this.yearlyExpenseTags$.pipe(map((yearlyExpenseTags) => yearlyExpenseTags.map((d) => d.item))),
		]).pipe(
			map(([activeExpenses, account, availableExpenseTags]) =>
				this.personalAccountChartService.getWeeklyExpenseChartData(
					account,
					'week',
					availableExpenseTags,
					activeExpenses
				)
			)
		);

		// construct account overview vy the selected expense tags
		this.accountOverviewChartData$ = combineLatest([
			// selected expenses
			this.expenseFormControl.valueChanges.pipe(startWith(this.expenseFormControl.value)),
			// account
			this.personalAccountDetails$,
		]).pipe(
			switchMap(([selectedTags, account]) =>
				merge(
					[this.personalAccountChartService.getAccountGrowthChartData(account, 'week', selectedTags)],
					this.personalAccountChartService.getAccountIncomeExpenseChartData(account, 'week', selectedTags)
				).pipe(reduce((acc, curr) => [...acc, curr], [] as GenericChartSeries[]))
			)
		);

		this.personalAccountDailyData$ = this.filterDailyDataGroup.valueChanges.pipe(
			startWith(this.filterDailyDataGroup.getRawValue()),
			switchMap((formResult) =>
				this.personalAccountFacadeService.getPersonalAccountDailyData(
					this.personalAccountBasic.id,
					formResult.dateFilter!
				)
			)
		);

		// calculate expense chart for filtered data
		this.personalAccountDailyExpensePieChart$ = this.personalAccountDailyData$.pipe(
			map((result) => (!!result ? this.personalAccountChartService.getExpenseAllocationChartData(result) : null))
		);

		// aggregate daily data by tag
		this.accountTagAggregationForTimePeriod$ = this.personalAccountDailyData$.pipe(
			map((result) => this.personalAccountDataService.getPersonalAccountTagAggregation(result))
		);

		// TODO - implement UI
		this.accountTagAggregationForTimePeriod$.subscribe((res) => console.log('eeee', res));
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

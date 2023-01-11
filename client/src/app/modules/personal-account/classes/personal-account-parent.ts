import { Directive, inject, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { combineLatest, map, merge, Observable, reduce, startWith, switchMap } from 'rxjs';
import { PersonalAccountFacadeService } from '../../../core/api';
import {
	AccountIdentification,
	PersonalAccountDetailsFragment,
	PersonalAccountTagFragment,
	TagDataType,
} from '../../../core/graphql';
import { GenericChartSeries, InputSourceWrapper, ValuePresentItem } from '../../../shared/models';
import { AccountState } from '../models';
import { PersonalAccountChartService, PersonalAccountDataService } from '../services';

@Directive()
export abstract class PersonalAccountParent {
	@Input() set accountIdentification(data: AccountIdentification | null) {
		this.personalAccountBasic = data;
		if (data) {
			this.initData(data);
		}
	}

	personalAccountDetails$!: Observable<PersonalAccountDetailsFragment>;

	yearlyExpenseTags$!: Observable<ValuePresentItem<PersonalAccountTagFragment>[]>;

	// current account state totalIncome, totalExpense and difference
	accountState$!: Observable<AccountState>;

	// growth chart by selected expenses
	accountOverviewChartData$!: Observable<GenericChartSeries[]>;

	// expense chart by the selected expenses tags
	expenseTagsChartData$!: Observable<GenericChartSeries[]>;

	// chart categories for X-axis
	categories$!: Observable<string[]>;

	// values to filter daily data based on some date (year-month-week)
	filterDateInputSourceWrapper$!: Observable<InputSourceWrapper[]>;

	filterForm = new FormGroup({
		dateFilter: new FormControl<string>('', { nonNullable: true }),
	});

	// keeps track of visible tags, if empty -> all is visible
	expenseFormControl = new FormControl<PersonalAccountTagFragment[]>([], { nonNullable: true });

	personalAccountBasic: AccountIdentification | null = null;

	personalAccountFacadeService = inject(PersonalAccountFacadeService);
	personalAccountChartService = inject(PersonalAccountChartService);
	personalAccountDataService = inject(PersonalAccountDataService);

	constructor() {}

	private initData(account: AccountIdentification): void {
		this.personalAccountDetails$ = this.personalAccountFacadeService.getPersonalAccountDetailsById(account.id);

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
			map((expenseTags) => this.personalAccountChartService.createValuePresentItemFromTag(expenseTags))
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
			// passing all avilable expense tags to create chart
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
	}
}

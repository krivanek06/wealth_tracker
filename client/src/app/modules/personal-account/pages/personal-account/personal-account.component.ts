import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { combineLatest, map, merge, Observable, reduce, startWith, switchMap } from 'rxjs';
import { AccountState } from '../../models';
import { PersonalAccountChartService } from '../../services';
import { PersonalAccountApiService } from './../../../../core/api';
import {
	PersonalAccountOverviewBasicFragment,
	PersonalAccountTagFragment,
	TagDataType,
} from './../../../../core/graphql';
import { ChartType, GenericChartSeries, ValuePresentItem } from './../../../../shared/models';

@Component({
	selector: 'app-personal-account',
	templateUrl: './personal-account.component.html',
	styleUrls: ['./personal-account.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonalAccountComponent implements OnInit {
	@Input() personalAccountBasic!: PersonalAccountOverviewBasicFragment;

	yearlyExpenseTags$!: Observable<ValuePresentItem<PersonalAccountTagFragment>[]>;

	// currect account state totalIncome, totalExpense and difference
	accountState$!: Observable<AccountState>;

	// growth chart by selected expenses
	accountOverviewChartData$!: Observable<GenericChartSeries[]>;

	// expense chart by the selected expenses tags
	expenseTagsChartData$!: Observable<GenericChartSeries[]>;

	// chart categories for X-axis
	categories$!: Observable<string[]>;

	// keeps track of visible tags, if empty -> all is visible
	expenseFormControl = new FormControl<PersonalAccountTagFragment[]>([], { nonNullable: true });

	ChartType = ChartType;

	constructor(
		private personalAccountApiService: PersonalAccountApiService,
		private personalAccountChartService: PersonalAccountChartService
	) {}

	ngOnInit(): void {
		// calculate account state - balance, cash, invested
		this.accountState$ = this.personalAccountApiService
			.getPersonalAccountOverviewById(this.personalAccountBasic.id)
			.pipe(map((account) => this.personalAccountChartService.getAccountState(account)));

		// filter out expense tags to show them to the user
		this.yearlyExpenseTags$ = this.personalAccountApiService
			.getPersonalAccountOverviewById(this.personalAccountBasic.id)
			.pipe(
				map((account) => account.yearlyAggregaton.filter((d) => d.tag.type === TagDataType.Expense)),
				map((expenseTags) => this.personalAccountChartService.createValuePresentItemFromTag(expenseTags))
			);

		// get chart categoties displayed on X-axis
		this.categories$ = this.personalAccountApiService
			.getPersonalAccountOverviewById(this.personalAccountBasic.id)
			.pipe(map((account) => this.personalAccountChartService.getChartCategories(account)));

		// construct expense chart by the selected expenses tags
		this.expenseTagsChartData$ = combineLatest([
			// selected expenses
			this.expenseFormControl.valueChanges.pipe(startWith(this.expenseFormControl.value)),
			// account
			this.personalAccountApiService.getPersonalAccountOverviewById(this.personalAccountBasic.id),
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
			this.personalAccountApiService.getPersonalAccountOverviewById(this.personalAccountBasic.id),
		]).pipe(
			switchMap(([selectedTags, account]) =>
				merge(
					[this.personalAccountChartService.getAccountGrowthChartData(account, 'week', selectedTags)],
					this.personalAccountChartService.getAccountIncomeExpenseChartData(account, 'week', selectedTags)
				).pipe(reduce((acc, curr) => [...acc, curr], [] as GenericChartSeries[]))
			)
		);

		this.accountOverviewChartData$.subscribe((x) => console.log('accountOverviewChartData$', x));
	}
}

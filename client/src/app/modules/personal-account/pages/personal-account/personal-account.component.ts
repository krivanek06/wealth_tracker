import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { merge, Observable, reduce, startWith, switchMap } from 'rxjs';
import { AccountState } from '../../models';
import { PersonalAccountChartService } from '../../services';
import { PersonalAccountApiService } from './../../../../core/api';
import {
	PersonalAccountAggregationDataOutput,
	PersonalAccountOverviewFragment,
	PersonalAccountTagFragment,
	TagDataType,
} from './../../../../core/graphql';
import { GenericChartSeries } from './../../../../shared/models';

@Component({
	selector: 'app-personal-account',
	templateUrl: './personal-account.component.html',
	styleUrls: ['./personal-account.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonalAccountComponent implements OnInit {
	@Input() personalAccount!: PersonalAccountOverviewFragment;

	yearlyExpenseTags: PersonalAccountAggregationDataOutput[] = [];
	yearlyExpenseTotal!: number;
	accountState!: AccountState;

	chartData$!: Observable<GenericChartSeries[]>;
	categories!: string[];

	// keeps track of visible tags, if empty -> all is visible
	activeItemsFormControl = new FormControl<PersonalAccountTagFragment[]>([], { nonNullable: true });

	constructor(
		private personalAccountApiService: PersonalAccountApiService,
		private personalAccountChartService: PersonalAccountChartService
	) {}

	ngOnInit(): void {
		this.accountState = this.personalAccountChartService.getAccountState(this.personalAccount);
		this.yearlyExpenseTags = this.personalAccount.yearlyAggregaton.filter((d) => d.tag.type === TagDataType.Expense);
		this.yearlyExpenseTotal = this.yearlyExpenseTags.reduce((a, b) => a + b.value, 0);

		this.categories = this.personalAccountChartService.getChartCategories(this.personalAccount);

		this.chartData$ = this.activeItemsFormControl.valueChanges.pipe(
			startWith(this.activeItemsFormControl.value),
			switchMap((activeTags) =>
				merge(
					this.personalAccountChartService.getAccountIncomeExpenseChartData(this.personalAccount, 'week', activeTags),
					this.personalAccountChartService.getWeeklyExpenseChartData(this.personalAccount, 'week', activeTags)
				).pipe(reduce((acc, curr) => [...acc, curr], [] as GenericChartSeries[]))
			)
		);
	}
}

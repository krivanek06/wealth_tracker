import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { GenericChartSeriesInput } from '../../../../shared/models';
import { AccountState } from '../../models';
import { PersonalAccountDataModificationService } from '../../services';
import { PersonalAccountApiService } from './../../../../core/api';
import {
	PersonalAccountAggregationDataOutput,
	PersonalAccountOverviewFragment,
	TagDataType,
} from './../../../../core/graphql';

@Component({
	selector: 'app-personal-account',
	templateUrl: './personal-account.component.html',
	styleUrls: ['./personal-account.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonalAccountComponent implements OnInit {
	@Input() personalAccount!: PersonalAccountOverviewFragment;

	weeklyChartData!: GenericChartSeriesInput;
	weeklyExpenseChartDataCopy!: GenericChartSeriesInput;
	weeklyExpenseChartData!: GenericChartSeriesInput;
	yearlyExpenseAggregaton: PersonalAccountAggregationDataOutput[] = [];
	yearlyExpenseTotal!: number;
	activeValueItem: PersonalAccountAggregationDataOutput | null = null;
	accountState!: AccountState;

	constructor(
		private personalAccountApiService: PersonalAccountApiService,
		private modificationService: PersonalAccountDataModificationService
	) {}

	ngOnInit(): void {
		this.weeklyChartData = this.modificationService.getWeeklyChartData(this.personalAccount);
		this.weeklyExpenseChartDataCopy = this.modificationService.getWeeklyExpenseChartData(this.personalAccount);
		this.accountState = this.modificationService.getAccountState(this.personalAccount);

		this.yearlyExpenseAggregaton = this.personalAccount.yearlyAggregaton.filter(
			(d) => d.tagType === TagDataType.Expense
		);
		this.yearlyExpenseTotal = this.yearlyExpenseAggregaton.reduce((a, b) => a + b.value, 0);
		this.weeklyExpenseChartData = { ...this.weeklyExpenseChartDataCopy };
	}

	onExpenseTagClick(item: PersonalAccountAggregationDataOutput): void {
		this.activeValueItem = item === this.activeValueItem ? null : item;
		if (this.activeValueItem) {
			const visibleSeries = this.weeklyExpenseChartDataCopy.series.filter(
				(d) => d.name === this.activeValueItem?.tagName
			);
			this.weeklyExpenseChartData = { ...this.weeklyExpenseChartDataCopy, series: visibleSeries };
		} else {
			this.weeklyExpenseChartData = { ...this.weeklyExpenseChartDataCopy };
		}
	}
}

import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { GenericChartSeriesInput } from '../../../../shared/models';
import { AccountState, ValueItem } from '../../models';
import { PersonalAccountDataModificationService } from '../../services';
import { PersonalAccountApiService } from './../../../../core/api';
import { PersonalAccountOverviewFragment } from './../../../../core/graphql';

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
	valueItems: ValueItem[] = [];
	activeValueItem: ValueItem | null = null;
	accountState!: AccountState;

	constructor(
		private personalAccountApiService: PersonalAccountApiService,
		private modificationService: PersonalAccountDataModificationService
	) {}

	ngOnInit(): void {
		this.weeklyChartData = this.modificationService.getWeeklyChartData(this.personalAccount);
		this.weeklyExpenseChartDataCopy = this.modificationService.getWeeklyExpenseChartData(this.personalAccount);
		this.valueItems = this.modificationService.getYearlyExpenseValueItems(this.personalAccount);
		this.accountState = this.modificationService.getAccountState(this.personalAccount);

		this.weeklyExpenseChartData = { ...this.weeklyExpenseChartDataCopy };
	}

	onExpenseTagClick(item: ValueItem): void {
		this.activeValueItem = item === this.activeValueItem ? null : item;
		if (this.activeValueItem) {
			const visibleSeries = this.weeklyExpenseChartDataCopy.series.filter((d) => d.name === this.activeValueItem?.id);
			this.weeklyExpenseChartData = { ...this.weeklyExpenseChartDataCopy, series: visibleSeries };
		} else {
			this.weeklyExpenseChartData = { ...this.weeklyExpenseChartDataCopy };
		}
	}
}

import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
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

	yearlyExpenseTags: PersonalAccountAggregationDataOutput[] = [];
	yearlyExpenseTotal!: number;
	activeValueItem: PersonalAccountAggregationDataOutput | null = null;
	accountState!: AccountState;

	constructor(
		private personalAccountApiService: PersonalAccountApiService,
		private modificationService: PersonalAccountDataModificationService
	) {}

	ngOnInit(): void {
		this.accountState = this.modificationService.getAccountState(this.personalAccount);
		this.yearlyExpenseTags = this.personalAccount.yearlyAggregaton.filter((d) => d.tagType === TagDataType.Expense);
		this.yearlyExpenseTotal = this.yearlyExpenseTags.reduce((a, b) => a + b.value, 0);
	}

	onExpenseTagClick(item: PersonalAccountAggregationDataOutput): void {
		this.activeValueItem = item === this.activeValueItem ? null : item;
	}
}

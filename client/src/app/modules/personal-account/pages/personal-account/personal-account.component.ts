import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AccountState } from '../../models';
import { PersonalAccountChartService } from '../../services';
import { PersonalAccountApiService } from './../../../../core/api';
import {
	PersonalAccountAggregationDataOutput,
	PersonalAccountOverviewFragment,
	PersonalAccountTagFragment,
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
	accountState!: AccountState;

	// keeps track of visible tags, if empty -> all is visible
	activeItemsFormControl = new FormControl<PersonalAccountTagFragment[]>([], { nonNullable: true });

	constructor(
		private personalAccountApiService: PersonalAccountApiService,
		private modificationService: PersonalAccountChartService
	) {}

	ngOnInit(): void {
		this.accountState = this.modificationService.getAccountState(this.personalAccount);
		this.yearlyExpenseTags = this.personalAccount.yearlyAggregaton.filter((d) => d.tag.type === TagDataType.Expense);
		this.yearlyExpenseTotal = this.yearlyExpenseTags.reduce((a, b) => a + b.value, 0);
	}
}

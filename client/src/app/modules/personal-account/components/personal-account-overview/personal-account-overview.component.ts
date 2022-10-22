import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { PersonalAccountAggregationDataOutput, TagDataType } from './../../../../core/graphql/';

@Component({
	selector: 'app-personal-account-overview',
	templateUrl: './personal-account-overview.component.html',
	styleUrls: ['./personal-account-overview.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonalAccountOverviewComponent implements OnInit {
	@Input() set yearlyAggregaton(value: PersonalAccountAggregationDataOutput[]) {
		this.incomeTags = value.filter((data) => data.tagType === TagDataType.Income);
		this.expenseTags = value.filter((data) => data.tagType === TagDataType.Expense);

		this.incomeTotal = this.incomeTags.reduce((acc, curr) => acc + curr.value, 0);
		this.expenseTotal = this.expenseTags.reduce((acc, curr) => acc + curr.value, 0);
	}

	incomeTags!: PersonalAccountAggregationDataOutput[];
	incomeTotal!: number;

	expenseTags!: PersonalAccountAggregationDataOutput[];
	expenseTotal!: number;

	constructor() {}

	ngOnInit(): void {}
}

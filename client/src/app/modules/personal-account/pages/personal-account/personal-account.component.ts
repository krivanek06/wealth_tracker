import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { SwimlaneChartData } from '../../../../shared/models';
import { PersonalAccountApiService } from './../../../../core/api';
import { PersonalAccountOverviewFragment } from './../../../../core/graphql';

@Component({
	selector: 'app-personal-account',
	templateUrl: './personal-account.component.html',
	styleUrls: ['./personal-account.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonalAccountComponent implements OnInit {
	@Input() set personalAccount(data: PersonalAccountOverviewFragment) {
		this.yearlyChartData = data.yearlyAggregaton.map((d) => {
			return { name: d.tagName, value: d.value } as SwimlaneChartData;
		});
	}

	yearlyChartData!: SwimlaneChartData[];

	constructor(private personalAccountApiService: PersonalAccountApiService) {}

	ngOnInit(): void {}
}

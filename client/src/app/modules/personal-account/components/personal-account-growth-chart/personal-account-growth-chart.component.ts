import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { chartColors1, SwimlaneChartData } from './../../../../shared/models';

@Component({
	selector: 'app-personal-account-growth-chart',
	templateUrl: './personal-account-growth-chart.component.html',
	styleUrls: ['./personal-account-growth-chart.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonalAccountGrowthChartComponent implements OnInit {
	@Input() data!: SwimlaneChartData[];
	colorScheme: any = {
		domain: chartColors1,
	};
	constructor() {}

	ngOnInit(): void {}
}

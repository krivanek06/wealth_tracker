import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { chartColors1, SwimlaneChartDataSeries } from './../../../../shared/models';

@Component({
	selector: 'app-personal-account-expense-allocation-chart',
	templateUrl: './personal-account-expense-allocation-chart.component.html',
	styleUrls: ['./personal-account-expense-allocation-chart.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonalAccountExpenseAllocationChartComponent implements OnInit {
	@Input() data!: SwimlaneChartDataSeries[];
	colorScheme: any = {
		domain: chartColors1,
	};
	constructor() {}

	ngOnInit(): void {}
}

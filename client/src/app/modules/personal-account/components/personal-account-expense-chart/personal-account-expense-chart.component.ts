import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { chartColors1, SwimlaneChartData } from './../../../../shared/models';

@Component({
	selector: 'app-personal-account-expense-chart',
	templateUrl: './personal-account-expense-chart.component.html',
	styleUrls: ['./personal-account-expense-chart.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonalAccountExpenseChartComponent implements OnInit {
	@Input() data!: SwimlaneChartData[];
	colorScheme: any = {
		domain: chartColors1,
	};
	constructor() {}

	ngOnInit(): void {}
}

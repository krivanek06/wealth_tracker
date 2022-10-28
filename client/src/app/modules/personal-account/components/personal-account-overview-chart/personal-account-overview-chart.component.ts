import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { chartColors1, SwimlaneChartDataSeries } from '../../../../shared/models';

@Component({
	selector: 'app-personal-account-overview-chart',
	templateUrl: './personal-account-overview-chart.component.html',
	styleUrls: ['./personal-account-overview-chart.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonalAccountOverviewChartComponent implements OnInit {
	@Input() data!: SwimlaneChartDataSeries[];
	view: [number, number] = [800, 300];

	// options
	gradient: boolean = false;
	showLegend: boolean = true;
	showLabels: boolean = true;
	isDoughnut: boolean = false;

	colorScheme: any = {
		domain: chartColors1,
	};

	constructor() {}

	ngOnInit(): void {}

	onSelect(data: any): void {
		console.log('Item clicked', JSON.parse(JSON.stringify(data)));
	}
}

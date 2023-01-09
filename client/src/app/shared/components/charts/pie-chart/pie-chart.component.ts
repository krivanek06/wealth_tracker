import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { GenericChartSeriesPie } from '../../../models';

@Component({
	selector: 'app-pie-chart',
	templateUrl: './pie-chart.component.html',
	styleUrls: ['./pie-chart.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [CommonModule, HighchartsChartModule],
})
export class PieChartComponent implements OnInit {
	@Input() set chartData(data: GenericChartSeriesPie | null) {
		if (data) {
			this.initChart(data);
		}
	}

	@Input() heightPx = 400;

	Highcharts: typeof Highcharts = Highcharts;
	chart: any;
	updateFromInput = true;
	chartCallback: any;
	chartOptions: Highcharts.Options = {}; //  : Highcharts.Options

	constructor() {
		const self = this;

		this.chartCallback = (chart: any) => {
			console.log('chartCallback', chart);
			self.chart = chart; // new Highcharts.Chart(this.chartOptions); //chart;
		};
	}

	ngOnInit(): void {}

	private initChart(data: GenericChartSeriesPie) {
		this.chartOptions = {
			chart: {
				plotBackgroundColor: undefined,
				plotBorderWidth: undefined,
				plotShadow: false,
				backgroundColor: 'transparent',
				panning: {
					enabled: true,
				},
			},
			title: {
				text: 'Example title',
				align: 'center',
				style: {
					color: '#bababa',
					fontSize: '13px',
				},
			},
			scrollbar: {
				enabled: false,
			},
			credits: {
				enabled: false,
			},
			tooltip: {
				outside: true,
				borderWidth: 1,
				padding: 12,
				backgroundColor: '#232323',
				style: {
					fontSize: '14px',
					color: '#D9D8D8',
				},
				shared: true,

				pointFormatter: function () {
					const that = this as any;
					const value = that.y;
					console.log(that);

					// do not show 0 value in tooltip
					if (value === 0) {
						return '';
					}

					return `example`;
				},
				valueDecimals: 2,
			},
			series: [
				{
					name: 'Brands',
					colorByPoint: true,
					type: 'pie',
					data: [
						{
							name: 'Chrome',
							y: 70.67,
						},
						{
							name: 'Edge',
							y: 14.77,
						},
						{
							name: 'Firefox',
							y: 4.86,
						},
						{
							name: 'Safari',
							y: 2.63,
						},
						{
							name: 'Internet Explorer',
							y: 1.53,
						},
						{
							name: 'Opera',
							y: 1.4,
						},
						{
							name: 'Sogou Explorer',
							y: 0.84,
						},
						{
							name: 'QQ',
							y: 0.51,
						},
						{
							name: 'Other',
							y: 2.6,
						},
					],
				},
			],
		};
	}
}

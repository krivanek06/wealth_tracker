import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnChanges, ViewChild } from '@angular/core';
import * as Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { ChartType, GenericChartSeriesPie } from '../../../../../shared/models';
import { AccountState } from '../../../models';

@Component({
	selector: 'app-personal-account-tag-allocation-chart',
	standalone: true,
	imports: [CommonModule, HighchartsChartModule],
	templateUrl: './personal-account-tag-allocation-chart.component.html',
	styleUrls: ['./personal-account-tag-allocation-chart.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonalAccountTagAllocationChartComponent implements OnChanges {
	@Input() accountBalance?: AccountState | null;
	@Input() heightPx?: number;

	@Input() series?: GenericChartSeriesPie | null;

	@ViewChild('chartRef') chartRef!: any;

	Highcharts: typeof Highcharts = Highcharts;
	chart: any;
	updateFromInput = true;
	chartCallback: any;
	chartOptions: Highcharts.Options = {};

	constructor() {
		const self = this;

		this.chartCallback = (chart: any) => {
			console.log('chartCallback', chart);
			self.chart = chart;
		};
	}

	ngOnChanges(): void {
		if (this.series) {
			this.initChart(this.series);
		}
	}

	initChart(data: GenericChartSeriesPie) {
		this.chartOptions = {
			chart: {
				plotShadow: false,
				type: ChartType.pie,
				backgroundColor: 'transparent',
				height: this.heightPx ?? undefined,
			},
			title: {
				align: 'center',
				floating: true,
				verticalAlign: 'middle',
				useHTML: true,
				text: `
				  <div class="flex flex-col gap-1 items-center">
				    <span class="text-wt-primary-dark text-sm">Balance</span>
				    <span class="text-white text-base">$${
							this.accountBalance ? Math.round(this.accountBalance.total * 100) / 100 : 0
						}</span>
				  </div>
				`,

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
			legend: {
				enabled: false,
			},
			accessibility: {
				// point: {
				// 	valueSuffix: '%',
				// },
			},
			tooltip: {
				outside: true,
				borderWidth: 1,
				padding: 11,
				backgroundColor: '#232323',
				style: {
					fontSize: '12px',
					color: '#D9D8D8',
				},
				shared: true,
				valueDecimals: 2,
			},
			rangeSelector: {
				enabled: false,
			},
			plotOptions: {
				series: {
					borderWidth: 0,
					events: {
						legendItemClick: (e: any) => {
							e.preventDefault(); // prevent toggling series visibility
						},
					},
				},
				pie: {
					size: '50%',
					showInLegend: false,
					allowPointSelect: false,
					// depth: 35,
					// minSize: 90,
					// size: 200,
					// center: [300, 150],
					//allowPointSelect: true,
					dataLabels: {
						padding: 2,
						connectorPadding: 2,
						// shape: 'callout',
						// alignTo: this.dataLabelsAlignTo,
						// connectorShape: 'crookedLine',
						distance: 40,
						// crookDistance: 90,
						overflow: 'allow',
						crop: false,
						verticalAlign: 'middle',

						formatter: function () {
							const url = (this.point as any)?.custom;
							const percentage = this.percentage;
							const percentageRounded = Math.round(percentage * 100) / 100;
							const color = this.color ?? 'white';

							const image = `
              <div class="flex flex-col items-center gap-1">
                  <img src=${url} alt="Tag Image" class="h-6 w-6" />
                  <span style="color: ${color}" class="text-xs">${percentageRounded}%</span>
              </div>`;
							return image;
						},
						useHTML: true,
						color: '#cecece',
						enabled: true,
						format: undefined,
					},
					tooltip: {
						headerFormat: '',
						pointFormatter: function () {
							const that = this as any;
							// rounded value
							const rounded = Math.round(that.percentage * 100) / 100;

							const result = `
              <div class="text-sm">
                  <span style="color: ${that.color}">● ${that.name}: </span>
                  <span>${rounded}%</span>
              </div>
                `;
							return result;
						},
					},
				},
			},
			series: [data],
		};
	}
}

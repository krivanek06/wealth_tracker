import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnChanges, ViewChild } from '@angular/core';
import { HighchartsChartModule } from 'highcharts-angular';
import { ChartConstructor } from '../../../../../core/utils';
import { ChartType, GenericChartSeriesPie } from '../../../../../shared/models';

@Component({
	selector: 'app-personal-account-expense-pie-chart',
	standalone: true,
	imports: [CommonModule, HighchartsChartModule],
	template: `
		<highcharts-chart
			#chartRef
			*ngIf="isHighcharts"
			[Highcharts]="Highcharts"
			[options]="chartOptions"
			[callbackFunction]="chartCallback"
			[(update)]="updateFromInput"
			[oneToOne]="true"
			style="width: 98%; transform: scale(0.9); margin: auto; display: block"
		>
		</highcharts-chart>
	`,
	styles: [
		`
			:host {
				display: block;
			}
		`,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonalAccountExpensePieChartComponent extends ChartConstructor implements OnChanges {
	@Input() displayValue?: number | null;

	@Input() series?: GenericChartSeriesPie | null;

	@ViewChild('chartRef') chartRef!: any;

	constructor() {
		super();
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
			},
			title: {
				align: 'center',
				floating: true,
				verticalAlign: 'middle',
				useHTML: true,
				text: this.displayValue
					? `
				  <div class="flex flex-col gap-1 items-center">
				    <span class="text-wt-primary-dark text-sm">Balance</span>
				    <span class="text-white text-base">$${this.displayValue ? Math.round(this.displayValue * 100) / 100 : 0}</span>
				  </div>
				`
					: '',

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
							const point = this.point as any;

							const url = point?.custom;
							const name = point?.name;
							const percentage = this.percentage;
							const percentageRounded = Math.round(percentage * 100) / 100;
							const color = this.color ?? 'white';

							const imageSection = `<img src="./assets/personal-account-tags/${url}.svg" alt="Tag Image" class="h-6 w-6" />`;
							const nameSection = `
                <div>
                  <span style="color: ${color}">●</span>
                  <span class="text-wt-gray-light">${name}</span>
                </div>
                `;

							const image = `
              <div class="flex flex-col items-center gap-1">
                  ${url ? imageSection : nameSection}
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

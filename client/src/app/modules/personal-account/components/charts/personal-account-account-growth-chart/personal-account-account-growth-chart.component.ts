import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { ColorScheme } from '../../../../../core/models';
import { ChartConstructor } from '../../../../../core/utils';
import { GenericChartSeries } from '../../../../../shared/models';
@Component({
	selector: 'app-personal-account-account-growth-chart',
	template: `
		<ng-container *ngIf="isHighcharts">
			<highcharts-chart
				*ngIf="accountOverviewChartData; else skeletonLoading"
				[Highcharts]="Highcharts"
				[options]="chartOptions"
				[callbackFunction]="chartCallback"
				[(update)]="updateFromInput"
				[oneToOne]="true"
				style="width: 100%; display: block"
				[style.height.px]="heightPx"
			>
			</highcharts-chart>

			<!-- skeleton loading -->
			<ng-template #skeletonLoading>
				<div class="w-full g-skeleton" [style.height.px]="heightPx"></div>
			</ng-template>
		</ng-container>
	`,
	standalone: true,
	imports: [CommonModule, HighchartsChartModule],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonalAccountAccountGrowthChartComponent extends ChartConstructor implements OnChanges {
	// array of weeks
	@Input() categories?: string[] | null;

	// contains [total growth, total income, total expense]
	@Input() accountOverviewChartData?: GenericChartSeries[] | null;

	@Input() heightPx!: number;

	constructor() {
		super();
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes?.['accountOverviewChartData']?.currentValue) {
			this.initChart();
			this.initSeries();
		}

		if (this.chartOptions.xAxis) {
			(this.chartOptions.xAxis as any).categories = this.categories;
		}
	}

	private initSeries(): void {
		if (!this.accountOverviewChartData) {
			this.chartOptions.series = [];
			return;
		}

		this.chartOptions.series = [...this.accountOverviewChartData].map((d, index) => {
			return {
				name: d.name,
				type: d.name === 'Total' ? 'area' : d.name === 'Expense Entries' ? 'line' : 'column',
				color: d.name === 'Total' ? ColorScheme.PRIMARY_VAR : d.color,
				data: d.data,
				opacity: index === 0 ? 0.75 : 1,
				lineWidth: index === 0 || index === 2 ? 4 : 2,
				visible: true,
				dataLabels: {
					enabled: index === 0,
					// formatter: function () {
					// 	const that = this as any;
					// 	// format data label number to 2 decimals
					// 	return Highcharts.numberFormat(that.y, 2);
					// },
				},
				stack: index === 0 ? '' : index == 1 ? 'Income' : 'Expense',
				yAxis: index,
			} as Highcharts.SeriesOptionsType;
		});
	}

	private initChart() {
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
			yAxis: [
				{
					title: {
						text: '',
					},
					startOnTick: false,
					endOnTick: false,
					gridLineColor: '#66666655',
					opposite: false,
					gridLineWidth: 1,
					minorTickInterval: 'auto',
					tickPixelInterval: 40,
					minorGridLineWidth: 0,
					visible: true,
				},
				{
					title: {
						text: '',
					},
					startOnTick: false,
					endOnTick: false,
					gridLineColor: '#66666655',
					opposite: true,
					gridLineWidth: 1,
					minorTickInterval: 'auto',
					tickPixelInterval: 40,
					minorGridLineWidth: 0,
					visible: false,
				},
				{
					title: {
						text: '',
					},
					startOnTick: false,
					endOnTick: false,
					gridLineColor: '#66666655',
					opposite: true,
					gridLineWidth: 1,
					minorTickInterval: 'auto',
					tickPixelInterval: 40,
					minorGridLineWidth: 0,
					visible: false,
				},
				{
					title: {
						text: '',
					},
					startOnTick: false,
					endOnTick: false,
					gridLineColor: '#66666655',
					opposite: true,
					gridLineWidth: 1,
					minorTickInterval: 'auto',
					tickPixelInterval: 40,
					minorGridLineWidth: 0,
					visible: true,
				},
			],
			xAxis: {
				visible: true,
				crosshair: true,
				categories: [],
				labels: {
					rotation: -20,
					style: {
						color: '#8e8e8e',
						font: '10px Trebuchet MS, Verdana, sans-serif',
					},
				},
			},
			title: {
				text: 'Account Growth Chart',
				align: 'left',
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
			tooltip: {
				outside: true,
				borderWidth: 1,
				padding: 12,
				backgroundColor: '#232323',
				style: {
					fontSize: '16px',
					color: '#D9D8D8',
				},
				shared: true,
				useHTML: true,

				pointFormatter: function () {
					const that = this as any;
					const value = that.y;

					// do not show 0 value in tooltip
					if (value === 0) {
						return '';
					}

					const valueRounded = Math.round(value * 100) / 100;
					const sign = that.series.name === 'Expense Entries' ? '' : '$';

					const line = `
				    <div>
				      <span style="color: ${that.series.color}; line-height: 26px">● ${that.series.name} </span>
				      <span style="text-align: right">
                <span style="color: var(--gray-light); ">${sign}${valueRounded}</span>
                <span style="color: var(--gray-medium); ">${sign ? 'USD' : ''}</span>
              </span>
				    </div>
				  `;

					return line;
				},
				//pointFormat: '<span style="color:{point.color};">{point.name}asds</span>: <b>{point.y}</b><br/>',
				valueDecimals: 2,
			},
			rangeSelector: {
				enabled: false,
			},
			plotOptions: {
				area: {
					fillColor: {
						linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
						stops: [
							[0, ColorScheme.PRIMARY_VAR],
							[0.4, ColorScheme.PRIMARY_VAR],
							[1, 'transparent'],
						],
					},
					marker: {
						radius: 3,
					},
					lineWidth: 2,
					states: {
						hover: {
							lineWidth: 2,
						},
					},
					threshold: null,
				},
				column: {
					// pointPadding: 0.2,
					stacking: 'normal',
				},
				series: {
					borderWidth: 0,
					dataLabels: {
						color: '#cecece',
						enabled: true,
						format: '{point.y:,.2f}',
					},
					enableMouseTracking: true,
				},
			},
			series: [],
		};
	}
}

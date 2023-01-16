import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import * as Highcharts from 'highcharts/highstock';
import NoDataToDisplay from 'highcharts/modules/no-data-to-display';
import { GenericChartSeries } from './../../../../shared/models';

NoDataToDisplay(Highcharts);

@Component({
	selector: 'app-personal-account-overview-chart',
	templateUrl: './personal-account-overview-chart.component.html',
	styleUrls: ['./personal-account-overview-chart.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonalAccountOverviewChartComponent implements OnInit, OnChanges {
	@Input() categories!: string[];

	// contains [total growth, total income, total expense]
	@Input() accountOverviewChartData: GenericChartSeries[] = [];

	// contains expense by tags
	@Input() expenseTagsChartData: GenericChartSeries[] = [];

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
	ngOnChanges(changes: SimpleChanges): void {
		if (changes?.['accountOverviewChartData']?.currentValue) {
			this.initChart();
			this.initSeries();
			(this.chartOptions.xAxis as any).categories = this.categories;
		}
	}

	private initSeries(): void {
		if (this.accountOverviewChartData.length === 0) {
			this.chartOptions.series = [];
			return;
		}

		this.chartOptions.series = [...this.accountOverviewChartData, ...this.expenseTagsChartData].map((d, index) => {
			return {
				name: d.name,
				type: d.type,
				color: d.color,
				data: d.data,
				zIndex: index === 0 ? 100 : -1, // bring line chart into the front
				opacity: index === 0 || index === 2 ? 1.5 : 0.65,
				lineWidth: index === 0 || index === 2 ? 4 : 2,
				visible: true, // d.name !== 'Income'
				dataLabels: {
					enabled: d.name === 'Total' || d.name === 'Expense',
				},
				stack: index === 0 ? '' : index == 1 ? 'Income' : index == 2 ? 'Expense' : 'ExpenseByTag',
				yAxis: index === 0 ? 1 : index === 1 ? 2 : undefined,
			} as Highcharts.SeriesOptionsType;
		});
	}

	ngOnInit(): void {}

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
				text: '',
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
				itemStyle: {
					color: '#acacac',
					cursor: 'pointer',
				},
				itemHoverStyle: {
					color: '#241eaa',
				},
				itemHiddenStyle: {
					color: '#494949',
				},
				verticalAlign: 'top',
				align: 'right',
				layout: 'horizontal',
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
				useHTML: true,
				headerFormat: '<table><tr><th colspan="2">{point.key}</th></tr>',

				pointFormatter: function () {
					const that = this as any;
					const value = that.y;

					// do not show 0 value in tooltip
					if (value === 0) {
						return '';
					}

					// add divider for better formatting
					const addDivider = that.series.name === 'Expense' || that.series.name === 'Total';
					const valueColor = '#b2b2b2'; // that.series.name === 'Expense' || that.series.name === 'Income' ? that.series.color :

					const line = `
            <tr>
              <td style="color: ${that.series.color}; line-height: 26px">● ${that.series.name} </td>
              <td style="text-align: right"><b style="color: ${valueColor}">$${that.y}</b> USD</td>
            </tr>
          `;
					const lineDivider = addDivider ? `<td colspan="2"><hr/></td>` : '';

					return `${line} ${lineDivider}`;
				},
				footerFormat: '</table>',
				valueDecimals: 2,
			},
			rangeSelector: {
				enabled: false,
			},
			plotOptions: {
				line: {
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
						enabled: false,
						format: undefined,
					},
					enableMouseTracking: true,
				},
			},
			series: [],
		};
	}
}

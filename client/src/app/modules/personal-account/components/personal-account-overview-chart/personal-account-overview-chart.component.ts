import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts/highstock';
import NoDataToDisplay from 'highcharts/modules/no-data-to-display';
import { PersonalAccountDataModificationService } from '../../services';
import { PersonalAccountAggregationDataOutput, PersonalAccountOverviewFragment } from './../../../../core/graphql';
import { GenericChartSeries } from './../../../../shared/models';

NoDataToDisplay(Highcharts);

@Component({
	selector: 'app-personal-account-overview-chart',
	templateUrl: './personal-account-overview-chart.component.html',
	styleUrls: ['./personal-account-overview-chart.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonalAccountOverviewChartComponent implements OnInit {
	@Input() personalAccount!: PersonalAccountOverviewFragment;
	@Input() set activeValueItem(data: PersonalAccountAggregationDataOutput | null) {
		this.onExpenseTagClick(data);
	}

	private mergedCategories!: string[];

	private accountgrowthChartData!: GenericChartSeries;
	private expenseChartDataCopy!: GenericChartSeries[];
	private expenseChartData!: GenericChartSeries[];

	Highcharts: typeof Highcharts = Highcharts;
	chart: any;
	updateFromInput = true;
	chartCallback: any;
	chartOptions: Highcharts.Options = {}; //  : Highcharts.Options

	constructor(private modificationService: PersonalAccountDataModificationService) {
		const self = this;

		this.chartCallback = (chart: any) => {
			console.log('chartCallback', chart);
			self.chart = chart; // new Highcharts.Chart(this.chartOptions); //chart;
		};
	}

	ngOnInit(): void {
		this.mergedCategories = this.modificationService.getChartCategories(this.personalAccount);

		this.accountgrowthChartData = this.modificationService.getAccountgrowthChartData(this.personalAccount);
		this.expenseChartDataCopy = this.modificationService.getWeeklyExpenseChartData(this.personalAccount);
		this.expenseChartData = [...this.expenseChartDataCopy];

		this.initChart();
	}

	private onExpenseTagClick(item: PersonalAccountAggregationDataOutput | null): void {
		if (item) {
			const visibleSeries = this.expenseChartDataCopy.filter((d) => d.name === item.tagName);
			this.expenseChartData = [...visibleSeries];
		} else {
			this.expenseChartData = [...this.expenseChartDataCopy];
		}
		this.initChart();
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
						text: 'Total balance',
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
				{
					title: {
						text: 'Expense by tags',
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
			],
			xAxis: {
				visible: true,
				crosshair: true,
				categories: this.mergedCategories,
			},
			title: {
				text: 'Account overview',
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
				padding: 11,
				backgroundColor: '#232323',
				style: {
					fontSize: '12px',
					color: '#D9D8D8',
				},
				shared: true,
				useHTML: true,
				headerFormat: '<table><tr><th colspan="2">{point.key}</th></tr>',

				pointFormatter: function () {
					const that = this as any;
					const value = that.y;
					const line1 = `<tr><td style="color: ${that.series.color}">● ${that.series.name} </td>`;
					const line2 = `<td style="text-align: right"><b>${that.y} USD</b></td></tr>`;
					return `${line1} ${line2}`;
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
					pointPadding: 0.2,
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
			series: [this.accountgrowthChartData, ...this.expenseChartData].map((d, index) => {
				return {
					name: d.name,
					type: d.type,
					color: d.color,
					data: d.data,
					dataLabels: {
						enabled: index === 0,
					},
					yAxis: index === 0 ? 1 : undefined,
				} as Highcharts.SeriesOptionsType;
			}),
		};
	}
}

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import NoDataToDisplay from 'highcharts/modules/no-data-to-display';
import { InvestmentAccountGrowth } from '../../../../core/graphql';
import { GeneralFunctionUtil } from '../../../../core/utils';

NoDataToDisplay(Highcharts);

@Component({
	selector: 'app-investment-account-portfolio-growth-chart',
	templateUrl: './investment-account-portfolio-growth-chart.component.html',
	styleUrls: ['./investment-account-portfolio-growth-chart.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [CommonModule, HighchartsChartModule],
})
export class InvestmentAccountPortfolioGrowthChartComponent implements OnInit {
	@Input() set investmentAccountGrowth(data: InvestmentAccountGrowth[] | null) {
		this.initChart(data ?? []);
	}

	showSkeleton = true;

	Highcharts: typeof Highcharts = Highcharts;
	chart: any;
	updateFromInput = true;
	chartCallback: any;
	chartOptions: Highcharts.Options = {};
	constructor() {
		const self = this;

		this.chartCallback = (chart: any) => {
			self.chart = chart;
		};
	}

	ngOnInit(): void {}

	private getChartData(data: InvestmentAccountGrowth[]): {
		balance: number[][];
		cash: number[][];
		invested: number[][];
		ownedAssets: number[][];
	} {
		const cash = data.filter((d) => d.invested !== 0).map((point) => [Date.parse(point.date), point.cash]);
		const invested = data.filter((d) => d.invested !== 0).map((point) => [Date.parse(point.date), point.invested]);

		const balance = data
			.filter((d) => d.invested !== 0)
			.map((point) => [Date.parse(point.date), point.cash + point.invested]);

		// create points where owned symbol changed
		const ownedAssets = data
			.reduce((acc, curr) => {
				// first data in array
				if (acc.length == 0) {
					return [curr];
				}
				// const previous = acc[acc.length - 1];
				// if (previous.ownedAssets === curr.ownedAssets) {
				// 	return acc;
				// }

				return [...acc, curr];
			}, [] as InvestmentAccountGrowth[])
			.filter((d) => d.ownedAssets !== 0)
			.map((d) => [Date.parse(d.date), d.ownedAssets]);

		console.log({ cash, invested, ownedAssets });

		return { balance, cash, invested, ownedAssets };
	}

	private initChart(data: InvestmentAccountGrowth[]) {
		const { invested, cash, balance } = this.getChartData(data);

		this.chartOptions = {
			chart: {
				type: 'area',
				backgroundColor: 'transparent',
				panning: {
					enabled: true,
				},
			},
			noData: {
				style: {
					fontWeight: 'bold',
					fontSize: '15px',
					color: '#868686',
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
				// {
				// 	title: {
				// 		text: '',
				// 	},
				// 	startOnTick: false,
				// 	endOnTick: false,
				// 	gridLineColor: '#66666655',
				// 	opposite: false,
				// 	gridLineWidth: 1,
				// 	minorTickInterval: 'auto',
				// 	tickPixelInterval: 40,
				// 	minorGridLineWidth: 0,
				// 	visible: false,
				// },
			],
			xAxis: {
				visible: true,
				crosshair: true,
				type: 'datetime',
				// categories: data.map((d) => d.date),
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
			subtitle: undefined,
			scrollbar: {
				enabled: false,
			},
			credits: {
				enabled: false,
			},
			legend: {
				enabled: true,
				//floating: true,
				verticalAlign: 'top',
				align: 'right',
				//layout: 'vertical',
				//y: -8,
				//x: 50,
				itemStyle: {
					color: '#acacac',
					cursor: 'default',
					fontSize: '12px',
				},
				itemHoverStyle: {
					color: '#484d55',
				},
				itemHiddenStyle: {
					color: '#282828',
				},
				labelFormatter: function () {
					const that = this as any;
					return `<span style="color: ${that.color};">${that.name}</span>`;
				},
			},
			tooltip: {
				padding: 11,
				enabled: true,
				backgroundColor: '#232323',
				xDateFormat: '%A, %b %e, %Y',
				style: {
					fontSize: '15px',
					color: '#D9D8D8',
				},
				shared: true,
				headerFormat: '<p style="color:#909592; font-size: 12px">{point.key}</p><br/>',
				pointFormatter: function () {
					const that = this as any;
					const value = GeneralFunctionUtil.formatLargeNumber(that.y);
					const name = that.series.name.toLowerCase();
					const isCurrency = ['cash', 'invested'].includes(name);

					const displayTextName = isCurrency ? `Portfolio ${name}` : `${that.series.name}`;
					const displayTextValue = isCurrency ? `$${value}` : value;

					return `<p><span style="color: ${that.series.color}; font-weight: bold">● ${displayTextName}: </span><span>${displayTextValue}</span></p><br/>`;
				},
			},
			plotOptions: {
				area: {
					marker: {
						enabled: true,
						radius: 3,
					},
					lineWidth: 2,
					states: {
						hover: {
							lineWidth: 4,
						},
					},
					threshold: null,
				},
				series: {
					borderWidth: 2,
					enableMouseTracking: true,
					// events: {
					// 	legendItemClick: function () {
					// 		return false;
					// 	},
					// },
				},
			},
			series: [
				{
					color: '#00c4dd',
					type: 'area',
					fillColor: {
						linearGradient: {
							x1: 1,
							y1: 0,
							x2: 0,
							y2: 1,
						},
						stops: [
							[0, '#25aedd'],
							[1, 'transparent'],
						],
					},
					name: 'Balance',
					data: balance,
				},
				{
					color: '#6b00fa',
					type: 'area',
					yAxis: 1,
					opacity: 1,
					zIndex: 3,
					fillColor: {
						linearGradient: {
							x1: 1,
							y1: 0,
							x2: 0,
							y2: 1,
						},
						stops: [
							[0, '#7666fa'],
							[1, 'transparent'],
						],
					},
					name: 'Invested',
					data: invested,
				},
				{
					color: '#f24f18',
					type: 'area',
					visible: true,
					opacity: 0.6,
					yAxis: 1,
					zIndex: 2,
					name: 'Cash',
					data: cash,
					fillColor: {
						linearGradient: {
							x1: 1,
							y1: 0,
							x2: 0,
							y2: 1,
						},
						stops: [
							[0, '#f24f18'],
							[1, 'transparent'],
						],
					},
				},
			],
		};
	}
}

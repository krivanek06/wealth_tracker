import { BreakpointObserver } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	Input,
	OnChanges,
	OnInit,
	SimpleChanges,
} from '@angular/core';
import Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import NoDataToDisplay from 'highcharts/modules/no-data-to-display';
import { InvestmentAccountGrowth } from '../../../../core/graphql';
import { ChartConstructor, GeneralFunctionUtil } from '../../../../core/utils';
import { LAYOUT_SM } from '../../../../shared/models';

NoDataToDisplay(Highcharts);

@Component({
	selector: 'app-investment-account-portfolio-growth-chart',
	template: `
		<highcharts-chart
			*ngIf="isHighcharts"
			[Highcharts]="Highcharts"
			[options]="chartOptions"
			[callbackFunction]="chartCallback"
			style="width: 100%; display: block"
			[style.height.px]="550"
		>
		</highcharts-chart>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [CommonModule, HighchartsChartModule],
})
export class InvestmentAccountPortfolioGrowthChartComponent extends ChartConstructor implements OnInit, OnChanges {
	@Input() investmentAccountGrowth?: InvestmentAccountGrowth[] | null;

	constructor(private breakpointObserver: BreakpointObserver, private cd: ChangeDetectorRef) {
		super();
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes?.['investmentAccountGrowth']?.currentValue) {
			const isDesktop = this.breakpointObserver.isMatched(LAYOUT_SM);
			this.initChart(this.investmentAccountGrowth ?? [], !isDesktop);
		}
	}

	ngOnInit(): void {
		this.breakpointObserver.observe(LAYOUT_SM).subscribe((match) => {
			if (this.chart && this.investmentAccountGrowth) {
				this.initChart(this.investmentAccountGrowth, !match.matches);
				this.chart?.redraw();

				// use change detection otherwise does not redraw
				this.cd.detectChanges();
			}
		});
	}

	private getChartData(data: InvestmentAccountGrowth[]): {
		invested: number[][];
		ownedAssets: number[][];
	} {
		const invested = data.map((point) => [point.date, point.invested]);

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
			//.filter((d) => d.ownedAssets !== 0)
			.map((d) => [d.date, d.ownedAssets]);

		return { invested, ownedAssets };
	}

	private initChart(data: InvestmentAccountGrowth[], isMobileView: boolean) {
		const { invested } = this.getChartData(data);

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
					visible: !isMobileView,
				},
			],
			xAxis: {
				visible: true,
				crosshair: true,
				type: 'datetime',
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
				y: 15,
				floating: true,
				style: {
					color: '#8e8e8e',
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
				enabled: false,
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
					const displayTextValue = that.y === 0 ? '$0' : `$${value}`;

					return `<p><span style="color: ${that.series.color}; font-weight: bold" class="capitalize">● ${name}: </span><span>${displayTextValue}</span></p><br/>`;
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
					color: '#07b9b9',
					type: 'area',
					zIndex: 10,
					fillColor: {
						linearGradient: {
							x1: 1,
							y1: 0,
							x2: 0,
							y2: 1,
						},
						stops: [
							[0, '#12aaaa'],
							[1, 'transparent'],
						],
					},
					name: 'Invested',
					data: invested,
				},
			],
		};
	}
}

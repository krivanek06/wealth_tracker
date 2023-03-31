import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import * as Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import NoDataToDisplay from 'highcharts/modules/no-data-to-display';
import { map, Subject, takeUntil } from 'rxjs';
import { InvestmentAccountFacadeApiService } from '../../../../core/api';
import { ChartConstructor, GeneralFunctionUtil } from '../../../../core/utils';
import { getChartGenericColor } from '../../../../shared/models';

NoDataToDisplay(Highcharts);

@Component({
	selector: 'app-investment-account-growth-assets',
	standalone: true,
	imports: [CommonModule, MatDialogModule, MatButtonModule, HighchartsChartModule],
	templateUrl: './investment-account-growth-assets.component.html',
	styleUrls: ['./investment-account-growth-assets.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvestmentAccountGrowthAssetsComponent extends ChartConstructor implements OnInit, OnDestroy {
	destroyed$ = new Subject<void>();
	displayChart = false;

	constructor(
		private investmentAccountFacadeApiService: InvestmentAccountFacadeApiService,
		private dialog: MatDialog,
		private cd: ChangeDetectorRef
	) {
		super();
	}
	ngOnInit(): void {
		this.investmentAccountFacadeApiService
			.getInvestmentAccountGrowthAssets()
			.pipe(
				map((data) =>
					data.map((d, index) => {
						const result: Highcharts.SeriesOptionsType = {
							type: 'area',
							name: d.name,
							data: d.data,
							color: getChartGenericColor(index),
						};
						return result;
					})
				),
				takeUntil(this.destroyed$)
			)
			.subscribe((res) => {
				// console.log(res);
				this.initChart(res);
				this.displayChart = true;
				this.cd.detectChanges();
			});
	}

	ngOnDestroy(): void {
		this.destroyed$.next();
	}

	private initChart(seriesData: Highcharts.SeriesOptionsType[]): void {
		this.chartOptions = {
			chart: {
				type: 'area',
				backgroundColor: 'transparent',
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

					const name = that.series.name.toUpperCase();
					const displayTextValue = that.y === 0 ? '$0' : `$${value}`;

					return `<p><span style="color: ${that.series.color}; font-weight: bold" class="capitalize">● ${name}: </span><span>${displayTextValue}</span></p><br/>`;
				},
			},
			plotOptions: {
				area: {
					stacking: 'normal',
					lineColor: '#666666',
					lineWidth: 1,
					marker: {
						lineWidth: 1,
						lineColor: '#666666',
					},
				},
			},
			series: seriesData,
		};
	}
}

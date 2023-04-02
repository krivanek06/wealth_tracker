import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import * as Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import NoDataToDisplay from 'highcharts/modules/no-data-to-display';
import { combineLatest, distinctUntilChanged, map, Observable, startWith, takeUntil, tap } from 'rxjs';
import { InvestmentAccountFacadeApiService } from '../../../../core/api';
import { componentDestroyed } from '../../../../core/operators';
import { ChartConstructor, GeneralFunctionUtil } from '../../../../core/utils';
import { FormMatInputWrapperModule } from '../../../../shared/components';
import { DefaultImgDirective } from '../../../../shared/directives';
import { getChartGenericColor, InputSource } from '../../../../shared/models';
import { InvestmentAccountCalculatorService } from '../../services';

NoDataToDisplay(Highcharts);

@Component({
	selector: 'app-investment-account-growth-assets',
	standalone: true,
	imports: [
		CommonModule,
		MatDialogModule,
		MatButtonModule,
		HighchartsChartModule,
		FormMatInputWrapperModule,
		ReactiveFormsModule,
		MatChipsModule,
		DefaultImgDirective,
	],
	templateUrl: './investment-account-growth-assets.component.html',
	styleUrls: ['./investment-account-growth-assets.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvestmentAccountGrowthAssetsComponent extends ChartConstructor implements OnInit, OnDestroy {
	displayChart = false;

	/**
	 * Input source to display available symbols to filter
	 */
	symbolInputSource$!: Observable<InputSource[]>;

	symbolsControl = new FormControl<string[]>([], {
		nonNullable: true,
	});

	constructor(
		private investmentAccountFacadeApiService: InvestmentAccountFacadeApiService,
		private investmentAccountCalculatorService: InvestmentAccountCalculatorService,
		private dialog: MatDialog,
		private cd: ChangeDetectorRef
	) {
		super();
	}
	ngOnInit(): void {
		this.initChart([]);
		this.getChartSeries().subscribe((res) => {
			this.initChart(res);
			this.displayChart = true;
			this.cd.detectChanges();
		});

		this.symbolInputSource$ = this.investmentAccountCalculatorService.getAvailableTransactionSymbolsInputSource();
	}

	onToggleSymbols(sources: InputSource[]): void {
		if (this.symbolsControl.value.length > 0) {
			this.symbolsControl.patchValue([]);
		} else {
			const values = sources.map((d) => d.value as string);
			this.symbolsControl.patchValue(values);
		}
	}

	ngOnDestroy(): void {}

	getChartSeries(): Observable<Highcharts.SeriesOptionsType[]> {
		return combineLatest([
			this.symbolsControl.valueChanges.pipe(
				startWith(this.symbolsControl.value),
				distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
			),
			this.investmentAccountFacadeApiService.getInvestmentAccountGrowthAssets(),
		]).pipe(
			tap(() => {
				this.displayChart = false;
				this.cd.detectChanges();
			}),
			// filter out data that is not selected
			map(([selectedSymbols, data]) => data.filter((d) => selectedSymbols.includes(d.name))),
			map((data) =>
				data
					// filter out data that has no values
					.map((series) => {
						return { ...series, data: series.data.filter((d) => d[1] > 0) };
					})
					// create series data for chart
					.map((d, index) => {
						const result: Highcharts.SeriesOptionsType = {
							type: 'line',
							name: d.name,
							data: d.data,
							yAxis: 1,
							lineWidth: 4,
							color: getChartGenericColor(index),
						};
						return result;
					})
			),
			// include line series for total
			map((seriesData) => {
				const totalSeriesData = seriesData.reduce(
					(acc, curr) => {
						// [number, number] => [timestamp, value]
						const currData = curr.data as [number, number][]; // cast to correct type
						const accData = acc.data as [number, number][]; // cast to correct type

						// check if data in acc
						for (const data of currData) {
							const timestamp = data[0];
							const value = data[1];

							// get index of existing timestamp in acc
							const accDataIndex = accData.findIndex((d) => d[0] == timestamp);

							// if timestamp exists in acc, add value to existing value
							if (accDataIndex > -1) {
								accData[accDataIndex] = [accData[accDataIndex][0], accData[accDataIndex][1] + value];
							}
							// empty array or add value at the end of the array if timestamp higher than last element
							else if (accData.length === 0 || timestamp > accData[accData.length - 1][0]) {
								accData.push(data);
							} else {
								// find the index of timestamp where if hight than previous item but lower than next item
								const index = accData.findIndex((d, i) => timestamp > d[0] && timestamp < accData[i + 1][0]);
								// add value at the beginning of the array if timestamp lower than first element
								const usedIndex = index > -1 ? index : 0;
								// inset data into accData in index position
								accData.splice(usedIndex, 0, data);
							}
						}
						return { ...acc, data: accData };
					},
					{
						type: 'column',
						name: 'Total',
						data: [] as [number, number][],
						yAxis: 0,
						opacity: 0.55,
						color: '#07b9b9',
					} as Highcharts.SeriesColumnOptions
				);
				return [totalSeriesData, ...seriesData];
			}),
			takeUntil(componentDestroyed(this))
		);
	}

	private initChart(seriesData: Highcharts.SeriesOptionsType[]): void {
		this.chartOptions = {
			chart: {
				//type: 'area',
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
			series: seriesData,
		};
	}
}

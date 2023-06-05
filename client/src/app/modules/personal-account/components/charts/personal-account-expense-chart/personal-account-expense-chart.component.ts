import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { ColorScheme } from '../../../../../core/models';
import { ChartConstructor } from '../../../../../core/utils';
import { GenericChartSeries } from '../../../../../shared/models';

@Component({
	selector: 'app-personal-account-tag-spending-chart',
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
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [CommonModule, HighchartsChartModule],
})
export class PersonalAccountExpenseChartComponent extends ChartConstructor implements OnInit, OnChanges {
	@Input() categories!: string[] | null;

	// contains [total growth, total income, total expense]
	@Input() accountOverviewChartData?: GenericChartSeries[] | null;

	// contains expense by tags
	@Input() expenseTagsChartData?: GenericChartSeries[] | null;

	@Input() heightPx!: number;

	constructor() {
		super();
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes?.['accountOverviewChartData']?.currentValue) {
			this.initChart();
			this.initSeries();
			(this.chartOptions.xAxis as any).categories = this.categories;
		}
	}

	private initSeries(): void {
		if (!this.accountOverviewChartData || !this.expenseTagsChartData) {
			this.chartOptions.series = [];
			return;
		}

		const filteredNames = ['Balance', 'Income', 'Expense Entries'];
		this.chartOptions.series = [...this.accountOverviewChartData, ...this.expenseTagsChartData]
			.filter((d) => !filteredNames.includes(d.name ?? ''))
			.map((d, index) => {
				return {
					name: d.name,
					type: d.type,
					color: d.name === 'Expense' ? ColorScheme.PRIMARY_VAR : d.color,
					data: d.data,
					//zIndex: index === 0 ? 100 : -1, // bring line chart into the front
					opacity: index === 0 ? 1 : 0.75,
					lineWidth: index === 0 || index === 2 ? 4 : 1,
					visible: true, // d.name !== 'Income'
					dataLabels: {
						enabled: d.name === 'Balance' || d.name === 'Expense',
					},
					stack: index === 0 ? 'Expense' : 'ExpenseByTag',
					yAxis: index === 0 ? 0 : undefined,
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
				text: 'Expense chart',
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
					fontSize: '15px',
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
					const addDivider = that.series.name === 'Expense' || that.series.name === 'Balance';
					const valueRounded = Math.round(value * 100) / 100;

					const line = `
            <tr>
              <td style="color: ${that.series.color}; line-height: 26px">● ${that.series.name} </td>
              <td style="text-align: right">
                <span style="color: var(--gray-light)">$${valueRounded}</span>
              </td>
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

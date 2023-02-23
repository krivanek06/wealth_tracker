import * as Highcharts from 'highcharts';

export abstract class ChartConstructor {
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
}

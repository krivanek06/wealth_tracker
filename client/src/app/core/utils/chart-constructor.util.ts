import * as Highcharts from 'highcharts';

export abstract class ChartConstructor {
	Highcharts: typeof Highcharts = Highcharts;
	chart!: Highcharts.Chart;
	updateFromInput = true;

	chartCallback: Highcharts.ChartCallbackFunction = (chart) => {
		this.chart = chart;
	};

	chartOptions: Highcharts.Options = {};

	constructor() {}
}

import Highcharts from 'highcharts';
import NoDataToDisplay from 'highcharts/modules/no-data-to-display';

export abstract class ChartConstructor {
	Highcharts: typeof Highcharts = Highcharts;
	chart!: Highcharts.Chart;
	updateFromInput = true;

	// determine whether we use SSR or not
	// https://github.com/highcharts/highcharts-angular/issues/216
	isHighcharts = typeof Highcharts === 'object';

	chartCallback: Highcharts.ChartCallbackFunction = (chart) => {
		this.chart = chart;
	};

	chartOptions: Highcharts.Options = {};

	constructor() {
		// used in constructor to avoid SSR error
		NoDataToDisplay(Highcharts);
	}
}

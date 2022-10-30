export interface SwimlaneChartData {
	name: string;
	series: SwimlaneChartDataSeries[];
}

export interface SwimlaneChartDataSeries {
	name: string;
	value: number;
	extra?: {
		code?: string;
	};
}

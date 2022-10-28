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

export const chartColors1 = [
	'#E8501E',
	'#DB355E',
	'#AD4185',
	'#AE4ABE',
	'#704F8F',
	'#FFE6D6',
	'#EBAA93',
	'#85AEE1',
	'#5564D9',
];

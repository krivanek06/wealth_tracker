export enum ChartType {
	line = 'line',
	column = 'column',
	pie = 'pie',
	area = 'area',
	areaChange = 'area-change',
	areaspline = 'areaspline',
	bar = 'bar',
	spline = 'spline',
	histogram = 'histogram',
	packedbubble = 'packedbubble',
}
export interface GenericChartSeries {
	type?: ChartType;
	name?: string;
	data: (number | null | undefined)[];
}

// Used only for Pie charts
export interface GenericChartSeriesPie {
	type?: ChartType;
	name?: string;
	data: GenericChartSeriesData[];
	color?: string | any;
	lineWidth?: number;
	colorByPoint?: boolean;
	innerSize?: string;
	minPointSize?: number;
}

export interface GenericChartSeriesData {
	name?: string;
	sliced?: boolean;
	y: number;
	color?: string;
	z?: number;
}

export interface GenericChartSeriesInput {
	series: GenericChartSeries[];
	categories: string[];
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

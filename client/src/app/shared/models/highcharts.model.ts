export enum ChartType {
	line = 'line',
	column = 'column',
	columnStack = 'column',
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
	color?: string;
}

// Used only for Pie charts
export interface GenericChartSeriesPie {
	title?: string;
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

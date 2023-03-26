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
	data: (number | null | undefined)[] | [Date | number, number | null | undefined][];
	color?: string;
}

// Used only for Pie charts
export interface GenericChartSeriesPie {
	name?: string;
	data: GenericChartSeriesData[];
	colorByPoint?: boolean;
	innerSize?: string;
	type: 'pie';
}

export interface GenericChartSeriesData {
	name?: string;
	y: number;
	color?: string;
	custom?: any;
}

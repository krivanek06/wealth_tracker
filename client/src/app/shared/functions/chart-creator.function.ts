import { BUCKET_ASSETS } from '../../core/models';
import { GenericChartSeriesData } from '../models';

export const createGenericChartSeriesPie = <T, TKeyFirst extends keyof T, TKeySecond extends keyof T[TKeyFirst]>(
	data: (T & { totalValue?: number; value?: number })[],
	firstKey: TKeyFirst,
	secondKey?: TKeySecond,
	color?: TKeySecond,
	imageUrl?: TKeySecond,
	imageUrlFirst?: TKeyFirst
): GenericChartSeriesData[] => {
	const displayIndexes = 10;

	return data
		.reduce((acc, curr) => {
			const currData = secondKey ? curr[firstKey][secondKey] : curr[firstKey];
			const dataIndex = acc.findIndex((d) => d.name === currData);

			if (dataIndex === -1) {
				// new tag
				acc = [
					...acc,
					{
						name: String(currData),
						y: curr?.totalValue ?? curr?.value ?? 0,
						color: color ? String(curr[firstKey][color]) : undefined,
						custom: imageUrl ? curr[firstKey][imageUrl] : imageUrlFirst ? curr[imageUrlFirst] : undefined,
					},
				];
			} else {
				// increase value for tag
				acc[dataIndex].y += curr?.totalValue ?? curr?.value ?? 0;
			}

			return acc;
		}, [] as GenericChartSeriesData[])
		.sort((a, b) => b.y - a.y)
		.reduce((acc, curr, index) => {
			if (index <= displayIndexes) {
				return [...acc, curr];
			}

			// merge rest into 'Other' section
			acc[acc.length - 1].name = 'Other';
			acc[acc.length - 1].y += curr.y;
			acc[acc.length - 1].color = '#9ca3af';
			acc[acc.length - 1].custom = BUCKET_ASSETS.PAYMENT;

			return acc;
		}, [] as GenericChartSeriesData[]);
};

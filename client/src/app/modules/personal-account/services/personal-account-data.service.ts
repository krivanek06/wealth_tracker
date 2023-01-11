import { Injectable } from '@angular/core';
import { PersonalAccountWeeklyAggregationFragment } from '../../../core/graphql';
import { InputSource, InputSourceWrapper } from '../../../shared/models';
import { DateServiceUtil } from '../../../shared/utils';

@Injectable({
	providedIn: 'root',
})
export class PersonalAccountDataService {
	constructor() {}

	/**
	 * from weekly data where we have [year, month], we create InputSourceWrapper based on each month
	 * and items will be weeks in that month
	 * it is used for filtering account data based on month/week
	 *
	 * @param weeklyData
	 * @returns
	 */
	getMonthlyInputSource(weeklyData: PersonalAccountWeeklyAggregationFragment[]): InputSourceWrapper[] {
		return weeklyData
			.reduce((acc, curr) => {
				// format to 'January, 2022'
				const keyId = `${DateServiceUtil.formatDate(new Date(curr.year, curr.month, 1), 'LLLL')}, ${curr.year}`;

				const lastElement = acc[acc.length - 1];

				// item that will be added
				const weeklyItem: InputSource = {
					caption: `Week: ${curr.week}, ${keyId}`,
					value: curr.id,
				};

				// key in array, append curr as last item for the key
				if (lastElement?.name === keyId) {
					return [...acc.slice(0, acc.length - 1), { ...lastElement, items: [...lastElement.items, weeklyItem] }];
				}

				// create empty to filter by whole month
				const monthlyItem: InputSource = {
					caption: keyId,
					value: `${curr.year}-${curr.month}`,
				};

				// last item don't match key
				return [...acc, { name: keyId, items: [monthlyItem, weeklyItem] }] as InputSourceWrapper[];
			}, [] as InputSourceWrapper[])
			.reverse();
	}
}

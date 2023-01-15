import { Injectable } from '@angular/core';
import {
	PersonalAccountAggregationDataOutput,
	PersonalAccountDailyDataOutputFragment,
	PersonalAccountTagFragment,
	PersonalAccountWeeklyAggregationFragment,
} from '../../../core/graphql';
import { InputSource, InputSourceWrapper, ValuePresentItem } from '../../../shared/models';
import { DateServiceUtil } from '../../../shared/utils';
import { PersonalAccountTagAggregation } from '../models';

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
	 * Values for a month: [year-month-week] [2022-1, 2022-1-1, 2022-1-2, 2022-1-3, 2022-1-4]
	 *
	 * @param weeklyData
	 * @returns
	 */
	getMonthlyInputSource(weeklyData: PersonalAccountWeeklyAggregationFragment[]): InputSourceWrapper[] {
		return weeklyData
			.reduce((acc, curr) => {
				// format to 'January, 2022'
				const keyId = `${DateServiceUtil.formatDate(new Date(curr.year, curr.month, 1), 'LLLL')}, ${curr.year}`;

				const lastElement: InputSourceWrapper | undefined = acc[acc.length - 1];

				// item that will be added
				const weeklyItem: InputSource = {
					caption: `Week: ${curr.week}, ${keyId}`,
					value: curr.id, // year-month-week: 2022-2-12
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

	/**
	 *
	 * @param tags
	 * @returns transformed tags into a value type that is displayed for filtering purposes
	 */
	createValuePresentItemFromTag(
		tags: PersonalAccountAggregationDataOutput[]
	): ValuePresentItem<PersonalAccountTagFragment>[] {
		const totalValue = tags.reduce((a, b) => a + b.value, 0);

		return tags.map((d) => {
			const data: ValuePresentItem<PersonalAccountTagFragment> = {
				color: d.tag.color,
				imageSrc: d.tag.imageUrl,
				imageType: 'url',
				name: d.tag.name,
				value: d.value,
				valuePrct: d.value / totalValue,
				item: d.tag,
			};

			return data;
		});
	}

	getPersonalAccountTagAggregation(
		dailyData: PersonalAccountDailyDataOutputFragment[],
		isWeeklyView = false
	): PersonalAccountTagAggregation[] {
		const data = dailyData.reduce((acc, curr) => {
			const key = curr.tagId;
			const selectedTag: PersonalAccountTagAggregation = acc[key];

			// already in accumulator
			if (selectedTag) {
				return {
					...acc,
					...{
						[key]: {
							...acc[key],
							// increase total entry
							totalEntries: selectedTag.totalEntries + 1,
							// add total value
							totalValue: selectedTag.totalValue + curr.value,
							// save last entry time period
							lastDataEntryDate: curr.date > selectedTag.lastDataEntryDate ? curr.date : selectedTag.lastDataEntryDate,
							// increase budgetToTimePeriodFilled
							budgetToTimePeriodFilledPrct:
								selectedTag.budgetToTimePeriodFilledPrct +
								(selectedTag.budgetToTimePeriod ? curr.value / selectedTag.budgetToTimePeriod : 0),
						},
					},
				};
			}

			// data not yet present
			const weeksInMonth = DateServiceUtil.getWeeksInMonth(Number(curr.date));
			const budgetMonthly = curr.personalAccountTag.budgetMonthly;
			const budgetToTimePeriod = isWeeklyView && budgetMonthly ? budgetMonthly / weeksInMonth : budgetMonthly;

			const newData: PersonalAccountTagAggregation = {
				id: curr.tagId,
				name: curr.personalAccountTag.name,
				color: curr.personalAccountTag.color,
				imageUrl: curr.personalAccountTag.imageUrl,
				type: curr.personalAccountTag.type,
				totalEntries: 1,
				totalValue: curr.value,
				lastDataEntryDate: curr.date,
				isWeeklyView,
				budgetToTimePeriod,
				budgetToTimePeriodFilledPrct: budgetToTimePeriod ? curr.value / budgetToTimePeriod : 0,
			};
			return { ...acc, [key]: newData };
		}, {} as { [key: string]: PersonalAccountTagAggregation });

		return Object.values(data);
	}
}

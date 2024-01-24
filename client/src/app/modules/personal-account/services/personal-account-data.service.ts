import { computed, Injectable } from '@angular/core';
import { DateServiceUtil } from '../../../core/utils';
import { InputSource, InputSourceWrapper, ValuePresentItem } from '../../../shared/models';
import { NO_DATE_SELECTED, PersonalAccountDailyDataAggregation, PersonalAccountTagAggregation } from '../models';
import {
	PersonalAccountAggregationDataOutput,
	PersonalAccountDailyDataNew,
	PersonalAccountService,
	PersonalAccountTag,
	PersonalAccountWeeklyAggregationOutput,
} from './../../../core/api';

@Injectable({
	providedIn: 'root',
})
export class PersonalAccountDataService {
	constructor(private personalAccountFacadeService: PersonalAccountService) {}

	availableTagInputSourceWrapper = computed(() => {
		const expenseTags = this.personalAccountFacadeService.personalAccountTagsExpenseSignal().map(
			(res) =>
				({
					caption: res.name,
					value: res.id,
					additionalData: res,
					image: res.image,
				}) satisfies InputSource
		);

		const incomeTags = this.personalAccountFacadeService.personalAccountTagsIncomeSignal().map(
			(res) =>
				({
					caption: res.name,
					value: res.id,
					additionalData: res,
					image: res.image,
				}) satisfies InputSource
		);

		const result: InputSourceWrapper[] = [
			{
				name: 'Expense',
				items: expenseTags,
			},
			{
				name: 'Income',
				items: incomeTags,
			},
		];

		return result;
	});

	/**
	 * from weekly data where we have [year, month], we create InputSourceWrapper based on each month
	 * and items will be weeks in that month
	 * it is used for filtering account data based on month/week
	 *
	 * Values for a month: [year-month-week] [2022-1, 2022-1-1, 2022-1-2, 2022-1-3, 2022-1-4]
	 * Adding value -1 to display total aggregation
	 *
	 * @param weeklyData
	 * @returns
	 */
	getMonthlyInputSource(weeklyData: PersonalAccountWeeklyAggregationOutput[]): InputSourceWrapper[] {
		// ability to filter everything
		const allData: InputSourceWrapper = {
			name: 'All data',
			items: [
				{
					caption: 'Select total aggregation',
					value: NO_DATE_SELECTED,
				},
			],
		};

		const monthlyInputSources = weeklyData
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

		return [allData, ...monthlyInputSources];
	}

	/**
	 *
	 * @param tags
	 * @returns transformed tags into a value type that is displayed for filtering purposes
	 */
	createValuePresentItemFromTag(tags: PersonalAccountAggregationDataOutput[]): ValuePresentItem<PersonalAccountTag>[] {
		const totalValue = tags.reduce((a, b) => a + b.value, 0);

		return tags.map((d) => {
			const data: ValuePresentItem<PersonalAccountTag> = {
				color: d.tag.color,
				imageSrc: d.tag.image,
				imageType: 'tagName',
				name: d.tag.name,
				value: d.value,
				valuePrct: d.value / totalValue,
				item: d.tag,
			};

			return data;
		});
	}

	getPersonalAccountTagAggregationByAggregationData(
		data: PersonalAccountAggregationDataOutput[]
	): PersonalAccountTagAggregation[] {
		const result = data.reduce(
			(acc, curr) => {
				const key = curr.tag.id;
				const selectedTag: PersonalAccountTagAggregation = acc[key];

				// already in accumulator
				if (selectedTag) {
					return {
						...acc,
						...{
							[key]: {
								...acc[key],
								// increase total entry
								totalEntries: selectedTag.totalEntries + curr.entries,
								// add total value
								totalValue: selectedTag.totalValue + curr.value,
							},
						},
					};
				}

				const newData: PersonalAccountTagAggregation = {
					id: curr.tag.id,
					name: curr.tag.name,
					color: curr.tag.color,
					imageUrl: curr.tag.image,
					type: curr.tag.type,
					totalEntries: curr.entries,
					totalValue: curr.value,
					lastDataEntryDate: null,
					isWeeklyView: false,
					budgetToTimePeriod: curr.tag.budgetMonthly,
				};
				return { ...acc, [key]: newData };
			},
			{} as { [key: string]: PersonalAccountTagAggregation }
		);

		return Object.values(result);
	}

	getPersonalAccountTagAggregationByDailyData(
		dailyData: PersonalAccountDailyDataNew[],
		dateFilter?: string
	): PersonalAccountTagAggregation[] {
		const [, , week] = dateFilter ? DateServiceUtil.dateSplitter(dateFilter) : [null, null, null];
		const isWeeklyView = !!week;

		const data = dailyData.reduce(
			(acc, curr) => {
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
								lastDataEntryDate:
									selectedTag.lastDataEntryDate && curr.date > selectedTag.lastDataEntryDate
										? curr.date
										: selectedTag.lastDataEntryDate,
							},
						},
					};
				}

				// data not yet present
				const weeksInMonth = DateServiceUtil.getWeeksInMonth(Number(curr.date));
				const budgetMonthly = curr.tag.budgetMonthly;
				const budgetToTimePeriod = isWeeklyView && budgetMonthly ? budgetMonthly / weeksInMonth : budgetMonthly;

				const newData: PersonalAccountTagAggregation = {
					id: curr.tagId,
					name: curr.tag.name,
					color: curr.tag.color,
					imageUrl: curr.tag.image,
					type: curr.tag.type,
					totalEntries: 1,
					totalValue: curr.value,
					lastDataEntryDate: curr.date,
					isWeeklyView,
					budgetToTimePeriod,
				};
				return { ...acc, [key]: newData };
			},
			{} as { [key: string]: PersonalAccountTagAggregation }
		);

		return Object.values(data);
	}

	/**
	 * divides an array of daily data by the same day, returning
	 *
	 * @param data
	 * @returns daily data aggregated by data
	 */
	aggregateDailyDataOutputByDays(data: PersonalAccountDailyDataNew[]): PersonalAccountDailyDataAggregation[] {
		return data
			.reduce((acc, curr) => {
				// check if an entry with the same date is already saved
				const lastItem = acc.find((d) => DateServiceUtil.isSameDay(d.date, curr.date));

				// if same date, add to the last entry in array
				if (lastItem) {
					lastItem.data = [...lastItem.data, curr];
					return acc;
				}

				// new unsaved date
				return [
					...acc,
					{
						date: curr.date,
						data: [curr],
					},
				];
			}, [] as PersonalAccountDailyDataAggregation[])
			.sort((a, b) => Number(b.date) - Number(a.date));
	}
}

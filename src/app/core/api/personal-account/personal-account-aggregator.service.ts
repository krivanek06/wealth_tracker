import { Injectable } from '@angular/core';
import { getWeeksInMonth, isSameDay } from 'date-fns';
import { flatMapDeep, groupBy } from 'lodash';
import { dateSplitter, getDetailsInformationFromDate, getObjectEntries } from '../../utils';
import { PERSONAL_ACCOUNT_DEFAULT_TAG_DATA, PersonalAccountTag } from './personal-account-tags.model';
import {
	AccountState,
	PersonalAccountAggregationDataOutput,
	PersonalAccountDailyData,
	PersonalAccountDailyDataAggregation,
	PersonalAccountMonthlyDataNew,
	PersonalAccountTagAggregation,
	PersonalAccountWeeklyAggregationOutput,
} from './personal-account-types.model';

@Injectable({
	providedIn: 'root',
})
export class PersonalAccountAggregatorService {
	getAllYearlyAggregatedData(
		availableTags: PersonalAccountTag[],
		monthlyData?: PersonalAccountMonthlyDataNew[]
	): PersonalAccountAggregationDataOutput[] {
		// merge together all daily data for each month
		const allDailyData =
			monthlyData?.reduce((acc, curr) => [...acc, ...curr.dailyData], [] as PersonalAccountDailyData[]) ?? [];

		const aggregationDataByTagId = allDailyData.reduce(
			(acc, curr) => {
				const previousAggregation = acc[curr.tagId];

				// create new or increase previous PersonalAccountAggregationDataOutput
				const data = !previousAggregation
					? {
							entries: 1,
							value: curr.value,
							tag: availableTags.find((d) => d.id === curr.tagId) ?? PERSONAL_ACCOUNT_DEFAULT_TAG_DATA,
						}
					: ({
							...previousAggregation,
							entries: previousAggregation.entries + 1,
							value: previousAggregation.value + curr.value,
						} as PersonalAccountAggregationDataOutput);

				return { ...acc, [curr.tagId]: data };
			},
			{} as { [K in string]: PersonalAccountAggregationDataOutput }
		);

		// format {key: value} to [value]
		const aggreagtionDataOutput = getObjectEntries(aggregationDataByTagId).map(([k, v]) => aggregationDataByTagId[k]);

		return aggreagtionDataOutput;
	}

	/**
	 * method used to format daily data for a easier managable data to display them on weekly/monthly chart
	 *
	 * @returns aggregated daily data (from personalAccountMonthlyData) by how much money was spent/earned
	 * by each distinct tag in a distinct [year, month, week] period.
	 * */
	getAllWeeklyAggregatedData(
		availableTags: PersonalAccountTag[],
		monthlyData?: PersonalAccountMonthlyDataNew[]
	): PersonalAccountWeeklyAggregationOutput[] {
		/**
		 * group each daily data from a monthly by a specific week
		 *
     	 * { '37': [ [Object], [Object], [Object], [Object] ] }
		 *
		 * {
				id: '47d29fc2-c4de-4bb4-a777-000f9081894b',
				tagId: '6342667c47b98948ce6e082c',
				value: 15.5,
				date: 2022-10-09T06:13:20.433Z,
				week: 37,
				userId: '634263587b936b70bef186ff'
			}
    	*/
		const monthlyDataGroupByWeek = (monthlyData ?? [])
			// if array is we end up with a '0: {}' that will result an undefined value in weeklyDataArray
			.filter((monthly) => monthly.dailyData.length > 0)
			// group daily data by week
			.map((monthly) => groupBy(monthly.dailyData, 'week'));

		/**
		 * converting { '37': [ [Object], [Object], '38': [ [Object], [Object]} => [ [ [Object], [Object] ], [ [Object], [Object] ] ]
		 * creating 2D array, where each nested array represent a distinct [year, month, week]
		 * used for easier data manipulation when grouping by tags
		 *
		 *  */
		const weeklyDataArray = flatMapDeep(monthlyDataGroupByWeek.map((d) => getObjectEntries(d).map(([k, v]) => v)));

		/**
		 * Construct an array of objects where weekly data (weeklyDataArray) will aggregated
		 * value (previousData.value + curr.value) for a distinct tag in a distics [year, month, week]
		 *  */
		const weeklyDataArrayGroupByTag = weeklyDataArray.reduce(
			(acc, curr) => {
				const dateKey = getDetailsInformationFromDate(curr.date);
				const KEY = dateKey.currentDateMonthWeek; //`${curr.year}-${curr.month}-${curr.week}`;

				// returning the previous PersonalAccountWeeklyAggregationOutput or creating a dummy one if not exists
				const weeklyAggregation = (acc[KEY] as PersonalAccountWeeklyAggregationOutput) ?? {
					id: KEY,
					year: dateKey.year,
					month: dateKey.month,
					week: dateKey.week,
					data: [],
				};

				// get index of the data which value we want to increment or -1 if new value
				const index = weeklyAggregation.data.findIndex((d) => d.tag.id === curr.tagId);
				if (index > -1) {
					// increment existing
					weeklyAggregation.data[index].entries += 1;
					weeklyAggregation.data[index].value += curr.value;
				} else {
					// add new data
					const data = {
						entries: 1,
						value: curr.value,
						tag: availableTags.find((d) => d.id === curr.tagId) ?? PERSONAL_ACCOUNT_DEFAULT_TAG_DATA,
					};
					weeklyAggregation.data = [...weeklyAggregation.data, data];
				}

				return { ...acc, [KEY]: weeklyAggregation };
			},
			{} as { [key: string]: PersonalAccountWeeklyAggregationOutput }
		);

		// format array of objects into one big object
		// it is fine because KEY is always different
		const weeklyDataArrayGroupByTagObject = weeklyDataArrayGroupByTag;
		/**
		 * mapping {'2023-9-37-6342667e47b98948ce6e0836': PersonalAccountWeeklyAggregation} ->[PersonalAccountWeeklyAggregation]
		 *  */
		const weeklyDataArrayGroupByTagArray = Object.keys(weeklyDataArrayGroupByTagObject).map(
			(key) => weeklyDataArrayGroupByTagObject[key]
		);

		return weeklyDataArrayGroupByTagArray;
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
		dailyData: PersonalAccountDailyData[],
		dateFilter?: string
	): PersonalAccountTagAggregation[] {
		const [, , week] = dateFilter ? dateSplitter(dateFilter) : [null, null, null];
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
				const weeksInMonth = getWeeksInMonth(Number(curr.date));
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
	aggregateDailyDataOutputByDays(data: PersonalAccountDailyData[]): PersonalAccountDailyDataAggregation[] {
		return data
			.reduce((acc, curr) => {
				// check if an entry with the same date is already saved
				const lastItem = acc.find((d) => isSameDay(d.date, curr.date));

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

	/**
	 *
	 * @param data
	 * @returns accumulated expenses, incomes and their difference
	 */
	getAccountState(data: PersonalAccountAggregationDataOutput[]): AccountState {
		const entriesTotal = data.reduce((acc, curr) => acc + curr.entries, 0);
		const expenseTotal = data.filter((d) => d.tag.type === 'EXPENSE').reduce((a, b) => a + b.value, 0);
		const incomeTotal = data.filter((d) => d.tag.type === 'INCOME').reduce((a, b) => a + b.value, 0);
		const total = incomeTotal - expenseTotal;

		const result: AccountState = {
			expenseTotal,
			incomeTotal,
			total,
			entriesTotal,
		};

		return result;
	}

	getAccountStateByDate(data: PersonalAccountWeeklyAggregationOutput[], dateFormat: string): AccountState {
		const [year, month, week] = dateSplitter(dateFormat);

		// filter out relevant data
		const weeklyAggregationFiltered = data.filter(
			(d) => d.year === year && d.month === month && (week ? d.week === week : 1)
		);

		// flatten array
		const aggregationOutput = weeklyAggregationFiltered.reduce(
			(acc, curr) => [...acc, ...curr.data],
			[] as PersonalAccountAggregationDataOutput[]
		);

		return this.getAccountState(aggregationOutput);
	}

	getAccountStateByDailyData(data: PersonalAccountDailyData[], userTags: PersonalAccountTag[]): AccountState {
		const expenseTags = userTags.filter((d) => d.type === 'EXPENSE').map((d) => d.id);
		const incomeTags = userTags.filter((d) => d.type === 'INCOME').map((d) => d.id);

		const entriesTotal = data.length;
		const expenseTotal = data.filter((d) => expenseTags.includes(d.tagId)).reduce((a, b) => a + b.value, 0);
		const incomeTotal = data.filter((d) => incomeTags.includes(d.tagId)).reduce((a, b) => a + b.value, 0);
		const total = incomeTotal - expenseTotal;

		const result: AccountState = {
			expenseTotal,
			incomeTotal,
			total,
			entriesTotal,
		};

		return result;
	}
}

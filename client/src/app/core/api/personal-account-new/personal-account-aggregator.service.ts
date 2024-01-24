import { Injectable } from '@angular/core';
import { groupBy } from 'lodash';
import { getObjectEntries } from '../../utils';
import { PersonalAccountTagImageName } from './personal-account-tags.model';
import {
	PersonalAccountAggregationDataOutput,
	PersonalAccountDailyDataNew,
	PersonalAccountMonthlyDataNew,
	PersonalAccountNew,
	PersonalAccountWeeklyAggregationOutput,
} from './personal-account-types.model';

@Injectable({
	providedIn: 'root',
})
export class PersonalAccountAggregatorService {
	getAllYearlyAggregatedData(
		personalAccount: PersonalAccountNew,
		monthlyData?: PersonalAccountMonthlyDataNew[]
	): PersonalAccountAggregationDataOutput[] {
		// merge together all daily data for each month
		const allDailyData =
			monthlyData?.reduce((acc, curr) => [...acc, ...curr.dailyData], [] as PersonalAccountDailyDataNew[]) ?? [];

		const aggregationDataByTagId = allDailyData.reduce(
			(acc, curr) => {
				const previousAggregation = acc[curr.tag.image];

				// create new or increase previous PersonalAccountAggregationDataOutput
				const data = !previousAggregation
					? { entries: 1, value: curr.value, tag: personalAccount.tags.find((d) => d.id === curr.tagId) }
					: ({
							...previousAggregation,
							entries: previousAggregation.entries + 1,
							value: previousAggregation.value + curr.value,
						} as PersonalAccountAggregationDataOutput);

				return { ...acc, [curr.tagId]: data };
			},
			{} as { [K in PersonalAccountTagImageName]: PersonalAccountAggregationDataOutput }
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
		personalAccount: PersonalAccountNew,
		monthlyData?: PersonalAccountMonthlyDataNew[]
	): PersonalAccountWeeklyAggregationOutput[] {
		// adding 'YEAR' and 'MONTH' keys to the daily data for easier manipulation
		const monthlyDataModified =
			monthlyData?.map((m) => {
				return {
					...m,
					dailyData: m.dailyData.map((d) => {
						return { ...d, year: m.year, month: m.month };
					}),
				};
			}) ?? [];

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
		const monthlyDataGroupByWeek = monthlyDataModified
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
		const weeklyDataArray = monthlyDataGroupByWeek
			.map(
				(d) => getObjectEntries(d).map(([k, v]) => v)
				// // creates 2D array by divided by 'week' key => { '37': [ {Object}], '38': [{Object}}
				// .reduce((acc, currKey) => [...acc, d[currKey]], [])
				// // group together monthly weekly data, convert { '37': [ {Object}], '38': [{Object}}  => [{Object}, {Object}]
				// .reduce((acc, curr) => [...acc, ...curr], [])
			)
			.flat()
			.flat();

		/**
		 * Construct an array of objects where weekly data (weeklyDataArray) will aggregated
		 * value (previousData.value + curr.value) for a distinct tag in a distics [year, month, week]
		 *  */
		const weeklyDataArrayGroupByTag = weeklyDataArray.reduce(
			(acc, curr) => {
				const KEY = `${curr.year}-${curr.month}-${curr.week}`;
				// returning the previous PersonalAccountWeeklyAggregationOutput or creating a dummy one if not exists
				const weeklyAggregation = (acc[KEY] as PersonalAccountWeeklyAggregationOutput) ?? {
					id: KEY,
					year: curr.year,
					month: curr.month,
					week: curr.week,
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
					const data = { entries: 1, value: curr.value, tag: personalAccount.tags.find((d) => d.id === curr.tagId)! };
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
}

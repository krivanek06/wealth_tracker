import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma';
import { LodashServiceUtil } from '../../../utils';
import { PersonalAccount, PersonalAccountDailyData } from '../entities';
import {
	PersonalAccountAggregationDataOutput,
	PersonalAccountDailyDataExtended,
	PersonalAccountWeeklyAggregationOutput,
} from '../outputs';
import { PersonalAccountTagService } from './personal-account-tag.service';

@Injectable()
export class PersonalAccounDataAggregatorService {
	constructor(private prisma: PrismaService, private personalAccountTagService: PersonalAccountTagService) {}

	async getAllYearlyAggregatedData({ id }: PersonalAccount): Promise<PersonalAccountAggregationDataOutput[]> {
		// load user all monthly data - already grouped by YEAR and MONTH
		const monthlyData = await this.prisma.personalAccountMonthlyData.findMany({
			where: {
				personalAccountId: id,
			},
		});

		// merge together all daily data for each month
		const allDailyData = monthlyData.reduce(
			(acc, curr) => [...acc, ...curr.dailyData],
			[] as PersonalAccountDailyData[]
		);

		const aggregationDataByTagId = allDailyData.reduce((acc, curr) => {
			const previousAggregation = acc[curr.tagId];

			// create new or increate previous PersonalAccountAggregationDataOutput
			const data = !previousAggregation
				? this.createPersonalAccountAggregationDataOutput(curr.tagId, curr.value)
				: ({
						...previousAggregation,
						entries: previousAggregation.entries + 1,
						value: previousAggregation.value + curr.value,
				  } as PersonalAccountAggregationDataOutput);

			return { ...acc, [curr.tagId]: data };
		}, {} as { [key: string]: PersonalAccountAggregationDataOutput });

		// format {key: value} to [value]
		const aggreagtionDataOutput = Object.keys(aggregationDataByTagId).map((k) => aggregationDataByTagId[k]);

		return aggreagtionDataOutput;
	}

	/**
	 * method used to format daily data for a easier managable data to display them on weekly/monthly chart
	 *
	 * @returns aggregated daily data (from personalAccountMonthlyData) by how much money was spent/earned
	 * by each distinct tag in a distinct [year, month, week] period.
	 * */
	async getAllWeeklyAggregatedData({ id }: PersonalAccount): Promise<PersonalAccountWeeklyAggregationOutput[]> {
		// load user all monthly data - already grouped by YEAR and MONTH
		const monthlyData = await this.prisma.personalAccountMonthlyData.findMany({
			where: {
				personalAccountId: id,
			},
		});

		// adding 'YEAR' and 'MONTH' keys to the daily data for easier manipulation
		const monthlyDataModified = monthlyData.map((m) => {
			return {
				...m,
				dailyData: m.dailyData.map((d) => {
					return { ...d, year: m.year, month: m.month } as PersonalAccountDailyDataExtended;
				}),
			};
		});

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
			.map(
				(monthly) =>
					LodashServiceUtil.groupBy(monthly.dailyData, 'week') as { [key: string]: PersonalAccountDailyDataExtended[] }
			) as [{ [key: string]: PersonalAccountDailyDataExtended[] }];

		/**
		 * converting { '37': [ [Object], [Object], '38': [ [Object], [Object]} => [ [ [Object], [Object] ], [ [Object], [Object] ] ]
		 * creating 2D array, where each nested array represent a distinct [year, month, week]
		 * used for easier data manipulation when grouping by tags
		 *
		 *  */
		const weeklyDataArray = monthlyDataGroupByWeek.map((d) =>
			Object.keys(d)
				// creates 2D array by divided by 'week' key => { '37': [ {Object}], '38': [{Object}}
				.reduce((acc, currKey) => [...acc, d[currKey]], [])
				// group together monthly weekly data, convert { '37': [ {Object}], '38': [{Object}}  => [{Object}, {Object}]
				.reduce((acc, curr) => [...acc, ...curr], [])
		) as [PersonalAccountDailyDataExtended[]];

		/**
		 * Construct an array of objects where weekly data (weeklyDataArray) will aggregated
		 * value (previousData.value + curr.value) for a distinct tag in a distics [year, month, week]
		 *  */
		const weeklyDataArrayGroupByTag = weeklyDataArray.map((weeklyData) =>
			weeklyData.reduce((acc, curr) => {
				const KEY = `${curr.year}-${curr.month}-${curr.week}`;
				// returning the previous PersonalAccountWeeklyAggregationOutput or creating a dummy one if not exists
				const weeklyAggregation =
					(acc[KEY] as PersonalAccountWeeklyAggregationOutput) ?? this.createAccountWeeklyDataAggregation(curr);

				// get index of the data which value we want to increment or -1 if new value
				const index = weeklyAggregation.data.findIndex((d) => d.tagId === curr.tagId);
				if (index > -1) {
					// increment existing
					weeklyAggregation.data[index].entries += 1;
					weeklyAggregation.data[index].value += curr.value;
				} else {
					// add new data
					const data = this.createPersonalAccountAggregationDataOutput(curr.tagId, curr.value);
					weeklyAggregation.data = [...weeklyAggregation.data, data];
				}

				return { ...acc, [KEY]: weeklyAggregation };
			}, {} as { [key: string]: PersonalAccountWeeklyAggregationOutput })
		);

		// format array of objects into one big object
		// it is fine because KEY is always different
		const weeklyDataArrayGroupByTagObject = weeklyDataArrayGroupByTag.reduce((a, b) => {
			return { ...a, ...b };
		}, {});

		/**
		 * mapping {'2023-9-37-6342667e47b98948ce6e0836': PersonalAccountWeeklyAggregation} ->[PersonalAccountWeeklyAggregation]
		 *  */
		const weeklyDataArrayGroupByTagArray = Object.keys(weeklyDataArrayGroupByTagObject).map(
			(key) => weeklyDataArrayGroupByTagObject[key]
		);

		return weeklyDataArrayGroupByTagArray;
	}

	private createAccountWeeklyDataAggregation(
		dailyExtend: PersonalAccountDailyDataExtended
	): PersonalAccountWeeklyAggregationOutput {
		const KEY = `${dailyExtend.year}-${dailyExtend.month}-${dailyExtend.week}`;
		const data: PersonalAccountWeeklyAggregationOutput = {
			id: KEY,
			year: dailyExtend.year,
			month: dailyExtend.month,
			week: dailyExtend.week,
			data: [],
		};

		return data;
	}

	private createPersonalAccountAggregationDataOutput(
		tagId: string,
		value: number
	): PersonalAccountAggregationDataOutput {
		const defaultTag = this.personalAccountTagService.getDefaultTagById(tagId);
		return { entries: 1, tagId, value, tagName: defaultTag.name, tagType: defaultTag.type };
	}
}

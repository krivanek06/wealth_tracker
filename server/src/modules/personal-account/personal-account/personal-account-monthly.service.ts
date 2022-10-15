import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { LodashServiceUtil } from '../../../utils';
import {
	PersonalAccount,
	PersonalAccountDailyDataExtended,
	PersonalAccountMonthlyData,
	PersonalAccountWeeklyAggregation,
} from './entities';

@Injectable()
export class PersonalAccountMonthlyService {
	constructor(private prisma: PrismaService) {}

	async getMonthlyDataByAccountId(personalAccountId: string): Promise<PersonalAccountMonthlyData[]> {
		return this.prisma.personalAccountMonthlyData.findMany({
			where: {
				personalAccountId,
			},
		});
	}

	async getMonthlyDataDailyEntries({ id }: PersonalAccountMonthlyData): Promise<number> {
		// TODO can it be done better, only selecting the length of the array?
		const personalAccount = await this.prisma.personalAccountMonthlyData.findFirst({
			where: {
				id,
			},
		});
		return personalAccount.dailyData.length ?? 0;
	}

	async createMonthlyData(personalAccountId: string, year, month): Promise<PersonalAccountMonthlyData> {
		return this.prisma.personalAccountMonthlyData.create({
			data: {
				personalAccountId,
				year,
				month,
				dailyData: [],
			},
		});
	}

	/**
	 * method used to format daily data for a easier managable data to display them on weekly/monthly chart
	 *
	 * @returns aggregated daily data (from personalAccountMonthlyData) by how much money was spent/earned
	 * by each distinct tag in a distinct [year, month, week] period.
	 * */
	async getAllWeeklyAggregatedData({ id }: PersonalAccount): Promise<PersonalAccountWeeklyAggregation[]> {
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
			);

		/**
		 * converting { '37': [ [Object], [Object]} => [ [ [Object], [Object] ], [ [Object], [Object] ] ]
		 * creating 2D array, where each nested array represent a distinct [year, month, week]
		 * used for easier data manipulation when grouping by tags
		 *
		 *  */

		const weeklyDataArray = monthlyDataGroupByWeek.map((d) => d[Object.keys(d)[0]]);

		/**
		 * Construct an array of objects where weekly data (weeklyDataArray) will aggregated
		 * value (previousData.value + curr.value) for a distinct tag in a distics [year, month, week]
		 *  */
		const weeklyDataArrayGroupByTag = weeklyDataArray.map((weeklyData) =>
			weeklyData.reduce((acc, curr) => {
				const KEY = `${curr.year}-${curr.month}-${curr.week}-${curr.tagId}`;
				// returning the previous PersonalAccountWeeklyAggregation or creating a dummy one if not exists
				const previousData = acc[KEY] as PersonalAccountWeeklyAggregation;
				const data = !previousData
					? this.convertAccountDailyDataToAccountWeeklyDataAggregation(curr)
					: ({
							...previousData,
							entries: previousData.entries + 1,
							value: previousData.value + curr.value,
					  } as PersonalAccountWeeklyAggregation);

				return { ...acc, [KEY]: data };
			}, {} as { [key: string]: PersonalAccountWeeklyAggregation })
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

	private convertAccountDailyDataToAccountWeeklyDataAggregation(
		dailyExtend: PersonalAccountDailyDataExtended
	): PersonalAccountWeeklyAggregation {
		const KEY = `${dailyExtend.year}-${dailyExtend.month}-${dailyExtend.week}-${dailyExtend.tagId}`;
		const data: PersonalAccountWeeklyAggregation = {
			id: KEY,
			entries: 1,
			year: dailyExtend.year,
			month: dailyExtend.month,
			week: dailyExtend.week,
			value: dailyExtend.value,
			personalAccountTagId: dailyExtend.tagId,
		};

		return data;
	}
}

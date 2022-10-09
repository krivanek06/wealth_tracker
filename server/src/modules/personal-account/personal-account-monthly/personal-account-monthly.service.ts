import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { LodashService } from './../../../utils/';
import {
	PersonalAccountDailyDataExtended,
	PersonalAccountWeeklyAggregation,
} from './entity/personal-account-weekly-aggregation.entity';

@Injectable()
export class PersonalAccountMonthlyService {
	constructor(private prisma: PrismaService) {}

	/**
	 * method used to format daily data for a easier managable data to display them on weekly/monthly chart
	 *
	 * @returns aggregated daily data (from personalAccountMonthlyData) by how much money was spent/earned
	 * by each distinct tag in a distinct [year, month, week] period.
	 * */
	async getAllWeeklyAggregatedData(personalAccountId = ''): Promise<PersonalAccountDailyDataExtended[]> {
		// TODO: this will be received from token
		const testUser = await this.prisma.user.findFirst();
		const testUserPersonalAccount = await this.prisma.personalAccount.findFirst();

		// load user all monthly data
		// already grouped by YEAR and MONTH
		const monthlyData = await this.prisma.personalAccountMonthlyData.findMany({
			where: {
				personalAccountId: testUserPersonalAccount.id,
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
		const monthlyDataGroupByWeek = monthlyDataModified.map(
			(monthly) =>
				LodashService.groupBy(monthly.dailyData, 'week') as { [key: string]: PersonalAccountDailyDataExtended[] }
		);

		/**
		 * converting { '37': [ [Object], [Object]} => [ [ [Object], [Object] ], [ [Object], [Object] ] ]
		 * creating 2D array, where each nested array represent a distinct [year, month, week]
		 * used for easier data manipulation when grouping by tags
		 *
		 *  */

		const weeklyDataArray = monthlyDataGroupByWeek.map((d) => d[Object.keys(d)[0]]);

		// helper

		/**
		 *
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
			}, {} as any)
		);

		return weeklyDataArrayGroupByTag;
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

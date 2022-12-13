import { Injectable } from '@angular/core';
import {
	PersonalAccountAggregationDataOutput,
	PersonalAccountDailyDataFragment,
	PersonalAccountWeeklyAggregationFragment,
	PersonalAccountWeeklyAggregationOutput,
	TagDataType,
} from '../../graphql';
import { DateServiceUtil } from './../../../shared/utils/date-service.util';
import { PersonalAccountCacheService } from './personal-account-cache.service';

@Injectable({
	providedIn: 'root',
})
export class PersonalAccountDataAggregatorService {
	constructor(private personalAccountCacheService: PersonalAccountCacheService) {}

	/**
	 *
	 * @param personalAccountId
	 * @param dailyData
	 * @param operation - increase add dailyData.value (create), 'decrease' removes the value (delete)
	 */
	updateAggregations(
		personalAccountId: string,
		dailyData: PersonalAccountDailyDataFragment,
		operation: 'increase' | 'decrease'
	): void {
		const personalAccount = this.personalAccountCacheService.getPersonalAccountOverview(personalAccountId);
		const dateDetails = DateServiceUtil.getDetailsInformationFromDate(Number(dailyData.date));
		const multiplyer = operation === 'increase' ? 1 : -1; // add or remove data from aggregation

		const isTagInYearlyAggregatopm = personalAccount.yearlyAggregaton.findIndex((d) => d.tag.id === dailyData.tag.id);

		// update yearlyAggregaton that match tagId or add new yearly data if not found
		const yearlyAggregaton: PersonalAccountAggregationDataOutput[] =
			isTagInYearlyAggregatopm !== -1
				? personalAccount.yearlyAggregaton.map((data) => {
						if (data.tag.id === dailyData.tagId) {
							return {
								...data,
								value: data.value + dailyData.value * multiplyer,
								entries: data.entries + 1 * multiplyer,
							};
						}
						return data;
				  })
				: [
						...personalAccount.yearlyAggregaton,
						{
							__typename: 'PersonalAccountAggregationDataOutput',
							entries: 1,
							tag: dailyData.tag,
							value: dailyData.value,
						},
				  ];

		// construct weekly aggregation ID
		const weeklyAggregationId = `${dateDetails.year}-${dateDetails.month}-${dateDetails.week}`;

		// if -1 means dailyData was created for not yet saved monthly data
		const weeklyAggregatonIndex = personalAccount.weeklyAggregaton.findIndex(
			(weeklyData) => weeklyData.id === weeklyAggregationId
		);

		// if -1 means there is not weekly aggregation for specific TAG
		const weeklyAggregatonDataIndex = personalAccount.weeklyAggregaton[weeklyAggregatonIndex]?.data?.findIndex(
			(d) => d.tag.id === dailyData.tag.id
		);

		// only used when monthly data not exists
		const weeklyAggregationData: PersonalAccountWeeklyAggregationOutput = {
			__typename: 'PersonalAccountWeeklyAggregationOutput',
			id: weeklyAggregationId,
			year: dateDetails.year,
			month: dateDetails.month,
			week: dateDetails.week,
			data: [
				{
					__typename: 'PersonalAccountAggregationDataOutput',
					entries: 1,
					tag: dailyData.tag,
					value: dailyData.value,
				},
			],
		};

		/**
		 * update weekly aggregation
		 * - change value for tag on a specific week
		 * - add tag value (if not present) for a specific week
		 * - add whole new week with tag value if week not exist and sort by date
		 */
		const weeklyAggregaton: PersonalAccountWeeklyAggregationFragment[] =
			weeklyAggregatonIndex === -1
				? // append new weeklyAggregationData to other, sort by date
				  [...personalAccount.weeklyAggregaton, weeklyAggregationData].sort(
						(a, b) => new Date(a.year, a.month, a.week).getTime() - new Date(b.year, b.month, b.week).getTime()
				  )
				: weeklyAggregatonDataIndex === -1
				? // append new weekly TAG aggregation
				  personalAccount.weeklyAggregaton.map((d) =>
						d.id === weeklyAggregationId
							? {
									...d,
									data: [
										...d.data,
										{
											__typename: 'PersonalAccountAggregationDataOutput',
											entries: 1,
											tag: dailyData.tag,
											value: dailyData.value,
										},
									],
							  }
							: { ...d }
				  )
				: // increase value for saved tag on specific week
				  personalAccount.weeklyAggregaton.map((d) =>
						d.id === weeklyAggregationId
							? {
									...d,
									data: d.data.map((dDaily) =>
										// found tag we want to mutate
										dDaily.tag.id === dailyData.tag.id
											? {
													...dDaily,
													entries: dDaily.entries + 1 * multiplyer,
													value: dDaily.value + dailyData.value * multiplyer,
											  }
											: { ...dDaily }
									),
							  }
							: { ...d }
				  );

		// update monthly data entries + income/expense
		const newMonthlyIncome = (dailyData.tag.type === TagDataType.Income ? dailyData.value : 0) * multiplyer;
		const newMonthlyExpense = (dailyData.tag.type === TagDataType.Expense ? dailyData.value : 0) * multiplyer;
		const monthlyData = personalAccount.monthlyData.map((d) => {
			if (d.id === dailyData.monthlyDataId) {
				return {
					...d,
					dailyEntries: d.dailyEntries + 1 * multiplyer,
					monthlyIncome: d.monthlyIncome + newMonthlyIncome,
					monthlyExpense: d.monthlyExpense + newMonthlyExpense,
				};
			}
			return d;
		});

		// update cache
		this.personalAccountCacheService.updatePersonalAccountOverview(personalAccountId, {
			...personalAccount,
			yearlyAggregaton,
			weeklyAggregaton,
			monthlyData,
		});
	}
}

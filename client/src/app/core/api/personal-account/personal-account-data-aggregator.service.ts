import { Injectable } from '@angular/core';
import {
	PersonalAccountAggregationDataOutput,
	PersonalAccountDailyDataOutputFragment,
	PersonalAccountWeeklyAggregationFragment,
	PersonalAccountWeeklyAggregationOutput,
} from '../../graphql';
import { DateServiceUtil } from '../../utils/date-service.util';
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
	updateAggregations(dailyData: PersonalAccountDailyDataOutputFragment, operation: 'increase' | 'decrease'): void {
		const personalAccount = this.personalAccountCacheService.getPersonalAccountDetails();
		const dateDetails = DateServiceUtil.getDetailsInformationFromDate(Number(dailyData.date));
		const multiplier = operation === 'increase' ? 1 : -1; // add or remove data from aggregation

		const isTagInYearlyAggregation = personalAccount.yearlyAggregation.findIndex((d) => d.tag.id === dailyData.tag.id);

		// update yearlyAggregation that match tagId or add new yearly data if not found
		const yearlyAggregation: PersonalAccountAggregationDataOutput[] =
			isTagInYearlyAggregation !== -1
				? personalAccount.yearlyAggregation.map((data) => {
						if (data.tag.id === dailyData.tagId) {
							return {
								...data,
								value: data.value + dailyData.value * multiplier,
								entries: data.entries + 1 * multiplier,
							};
						}
						return data;
				  })
				: [
						...personalAccount.yearlyAggregation,
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
		const weeklyAggregatonIndex = personalAccount.weeklyAggregation.findIndex(
			(weeklyData) => weeklyData.id === weeklyAggregationId
		);

		// if -1 means there is not weekly aggregation for specific TAG
		const weeklyAggregatonDataIndex = personalAccount.weeklyAggregation[weeklyAggregatonIndex]?.data?.findIndex(
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
		const weeklyAggregation: PersonalAccountWeeklyAggregationFragment[] =
			weeklyAggregatonIndex === -1
				? // append new weeklyAggregationData to other, sort by date
				  [...personalAccount.weeklyAggregation, weeklyAggregationData].sort(
						(a, b) => new Date(a.year, a.month, a.week).getTime() - new Date(b.year, b.month, b.week).getTime()
				  )
				: weeklyAggregatonDataIndex === -1
				? // append new weekly TAG aggregation
				  personalAccount.weeklyAggregation.map((d) =>
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
				  personalAccount.weeklyAggregation.map((d) =>
						d.id === weeklyAggregationId
							? {
									...d,
									data: d.data.map((dDaily) =>
										// found tag we want to mutate
										dDaily.tag.id === dailyData.tag.id
											? {
													...dDaily,
													entries: dDaily.entries + 1 * multiplier,
													value: dDaily.value + dailyData.value * multiplier,
											  }
											: { ...dDaily }
									),
							  }
							: { ...d }
				  );

		// update cache
		this.personalAccountCacheService.updatePersonalAccountDetails({
			...personalAccount,
			yearlyAggregation,
			weeklyAggregation,
		});
	}
}

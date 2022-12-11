import { Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import {
	CreatedMonthlyDataSubscriptionGQL,
	GetPersonalAccountMonthlyDataByIdGQL,
	PersonalAccountDailyDataFragment,
	PersonalAccountMonthlyDataDetailFragment,
	PersonalAccountMonthlyDataOverviewFragment,
} from '../../graphql';
import { PersonalAccountCacheService } from './personal-account-cache.service';

@Injectable({
	providedIn: 'root',
})
export class PersonalAccountMonthlyDataService {
	constructor(
		private getPersonalAccountMonthlyDataByIdGQL: GetPersonalAccountMonthlyDataByIdGQL,
		private createdMonthlyDataSubscriptionGQL: CreatedMonthlyDataSubscriptionGQL,
		private personalAccountCacheService: PersonalAccountCacheService
	) {
		this.createdMonthlyDataSubscription().pipe().subscribe();
	}

	getPersonalAccountMonthlyDataById(monthlyDataId: string): Observable<PersonalAccountMonthlyDataDetailFragment> {
		return this.getPersonalAccountMonthlyDataByIdGQL
			.watch({
				input: monthlyDataId,
			})
			.valueChanges.pipe(map((res) => res.data.getPersonalAccountMonthlyDataById));
	}

	/**
	 * Persist daily data into monthly.dailyData array
	 * if monthly data not loaded, skip the operation, daily data will be loaded by getPersonalAccountMonthlyDataById
	 *
	 * @param dailyData
	 * @param operation
	 * @returns
	 */
	updateMonthlyDailyData(dailyData: PersonalAccountDailyDataFragment, operation: 'add' | 'remove'): void {
		const monthlyDetails = this.personalAccountCacheService.getPersonalAccountMonthlyDataByIdFromCache(
			dailyData.monthlyDataId
		);

		// happens when creating a daily data to the future/past months - information received by subscriptions
		if (!monthlyDetails) {
			return;
		}

		// add or remove dailyData into array
		const updatedDailyData =
			operation === 'add'
				? [...monthlyDetails.dailyData, dailyData]
				: monthlyDetails.dailyData.filter((d) => d.id !== dailyData.id);

		// update cache
		this.personalAccountCacheService.updatePersonalAccountMonthly(monthlyDetails.id, {
			...monthlyDetails,
			dailyData: updatedDailyData,
		});
	}

	private createdMonthlyDataSubscription(): Observable<PersonalAccountMonthlyDataOverviewFragment | undefined> {
		return this.createdMonthlyDataSubscriptionGQL.subscribe().pipe(
			map((res) => res.data?.createdMonthlyData),
			tap((createdMonthlyData) => {
				if (!createdMonthlyData) {
					return;
				}
				console.log('subscription', createdMonthlyData);
				// save createdMonthlyData into PersonalAccount.monthlyData
				const personalAccount = this.personalAccountCacheService.getPersonalAccountOverview(
					createdMonthlyData.personalAccountId
				);

				// sort ASC
				const mergedMonthlyData = [...personalAccount.monthlyData, createdMonthlyData].sort((a, b) =>
					b.year > a.year ? -1 : b.year === a.year && b.month > a.month ? -1 : 1
				);

				// update cache
				this.personalAccountCacheService.updatePersonalAccountOverview(personalAccount.id, {
					...personalAccount,
					monthlyData: mergedMonthlyData,
				});
			})
		);
	}
}

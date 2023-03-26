import { Injectable } from '@angular/core';
import { FetchResult } from '@apollo/client/core';
import { filter, map, Observable, tap } from 'rxjs';
import {
	AccountType,
	EditPersonalAccountMutation,
	PersonalAccountDailyDataCreate,
	PersonalAccountDailyDataDelete,
	PersonalAccountDailyDataEdit,
	PersonalAccountDailyDataEditOutput,
	PersonalAccountDailyDataOutputFragment,
	PersonalAccountDetailsFragment,
	PersonalAccountEditInput,
	PersonalAccountOverviewFragment,
	PersonalAccountTag,
	PersonalAccountTagDataCreate,
	PersonalAccountTagDataDelete,
	PersonalAccountTagDataEdit,
	PersonalAccountTagFragment,
	TagDataType,
} from '../../graphql';
import { DateServiceUtil } from '../../utils/date-service.util';
import { AccountManagerCacheService } from '../account-manager';
import { PersonalAccountApiService } from './personal-account-api.service';
import { PersonalAccountCacheService } from './personal-account-cache.service';
import { PersonalAccountDataAggregatorService } from './personal-account-data-aggregator.service';

@Injectable({
	providedIn: 'root',
})
export class PersonalAccountFacadeService {
	constructor(
		private personalAccountApiService: PersonalAccountApiService,
		private personalAccountDataAggregatorService: PersonalAccountDataAggregatorService,
		private personalAccountCacheService: PersonalAccountCacheService,
		private accountManagerCacheService: AccountManagerCacheService
	) {}

	getPersonalAccountAvailableTagImages(): Observable<string[]> {
		return this.personalAccountApiService.getPersonalAccountAvailableTagImages();
	}

	getPersonalAccountDetailsByUser(): Observable<PersonalAccountDetailsFragment> {
		return this.personalAccountApiService
			.getPersonalAccountDetails()
			.pipe(filter((data): data is PersonalAccountDetailsFragment => !!data));
	}

	getPersonalAccountTagFromCache(tagId: string): PersonalAccountTagFragment | null {
		return this.personalAccountCacheService.getPersonalAccountTagFromCache(tagId);
	}

	createPersonalAccount(): Observable<PersonalAccountOverviewFragment | undefined> {
		return this.personalAccountApiService.createPersonalAccount().pipe(
			tap((result) => {
				if (!result) {
					return;
				}

				// update cache
				this.accountManagerCacheService.createAccountType(result);
			})
		);
	}

	editPersonalAccount(input: PersonalAccountEditInput): Observable<FetchResult<EditPersonalAccountMutation>> {
		return this.personalAccountApiService.editPersonalAccount(input).pipe(
			tap(() => {
				this.accountManagerCacheService.renameAccountType(input.name, AccountType.Personal);
			})
		);
	}

	deletePersonalAccount(): Observable<PersonalAccountOverviewFragment | undefined> {
		return this.personalAccountApiService.deletePersonalAccount().pipe(
			tap(() => {
				// update cache
				this.accountManagerCacheService.removeAccountType(AccountType.Personal);
			})
		);
	}

	getPersonalAccountTags(): Observable<PersonalAccountTag[]> {
		return this.getPersonalAccountDetailsByUser().pipe(map((account) => account?.personalAccountTag ?? []));
	}

	getPersonalAccountTagsExpense(): Observable<PersonalAccountTag[]> {
		return this.getPersonalAccountTags().pipe(map((tags) => tags.filter((d) => d.type === TagDataType.Expense)));
	}

	getPersonalTagsIncome(): Observable<PersonalAccountTag[]> {
		return this.getPersonalAccountTags().pipe(map((tags) => tags.filter((d) => d.type === TagDataType.Income)));
	}

	/**
	 *
	 * @param personalAccountId
	 * @param dateFormat - year-month-week
	 * @returns
	 */
	getPersonalAccountDailyData(dateFormat: string): Observable<PersonalAccountDailyDataOutputFragment[]> {
		const [year, month, week] = dateFormat.split('-').map((d) => Number(d));

		return this.personalAccountApiService
			.getPersonalAccountDailyData({
				year,
				month,
			})
			.pipe(
				// filter out correct week if selected
				map((dailyDataArray) =>
					!week ? dailyDataArray : dailyDataArray.filter((dailyData) => dailyData.week === week)
				)
			);
	}

	createPersonalAccountTag(input: PersonalAccountTagDataCreate): Observable<PersonalAccountTagFragment | null> {
		return this.personalAccountApiService.createPersonalAccountTag(input).pipe(
			tap((result) => {
				if (!result) {
					return;
				}

				const personalAccount = this.personalAccountCacheService.getPersonalAccountDetails();

				this.personalAccountCacheService.updatePersonalAccountDetails({
					...personalAccount,
					personalAccountTag: [...personalAccount.personalAccountTag, result],
				});
			})
		);
	}

	editPersonalAccountTag(input: PersonalAccountTagDataEdit): Observable<PersonalAccountTagFragment | null> {
		return this.personalAccountApiService.editPersonalAccountTag(input);
	}

	deletePersonalAccountTag(input: PersonalAccountTagDataDelete): Observable<PersonalAccountTagFragment | null> {
		return this.personalAccountApiService.deletePersonalAccountTag(input).pipe(
			tap((result) => {
				if (!result) {
					return;
				}

				const personalAccount = this.personalAccountCacheService.getPersonalAccountDetails();

				// remove tag from array in personal account
				this.personalAccountCacheService.updatePersonalAccountDetails({
					...personalAccount,
					personalAccountTag: personalAccount.personalAccountTag.filter((d) => d.id !== result.id),
					yearlyAggregation: personalAccount.yearlyAggregation.filter((d) => d.tag.id !== result.id),
				});
			})
		);
	}

	createPersonalAccountDailyEntry(
		input: PersonalAccountDailyDataCreate
	): Observable<PersonalAccountDailyDataOutputFragment | undefined> {
		return this.personalAccountApiService.createPersonalAccountDailyEntry(input).pipe(
			tap((entry) => {
				if (!entry) {
					return;
				}

				// check if daily data for specific data is in cache, if so, add this one too
				const { year, month } = DateServiceUtil.getDetailsInformationFromDate(input.date);
				const dailyDataCache = this.personalAccountCacheService.getPersonalAccountDailyDataFromCache({
					year,
					month,
				});

				// if daily data is loaded, add this on too sorted
				if (dailyDataCache) {
					this.personalAccountCacheService.updatePersonalAccountDailyDataCache([...dailyDataCache, entry], {
						year,
						month,
					});
				}

				// update yearly, monthly, weekly aggregation
				this.personalAccountDataAggregatorService.updateAggregations(entry, 'increase');
			})
		);
	}

	editPersonalAccountDailyEntry(input: PersonalAccountDailyDataEdit): Observable<PersonalAccountDailyDataEditOutput> {
		return this.personalAccountApiService.editPersonalAccountDailyEntry(input).pipe(
			tap((entry) => {
				const removedDailyData = entry.originalDailyData as PersonalAccountDailyDataOutputFragment;
				const addedDailyData = entry.modifiedDailyData as PersonalAccountDailyDataOutputFragment;

				// check if daily data for specific data is in cache, if so, add this one too
				const { year, month } = DateServiceUtil.getDetailsInformationFromDate(Number(addedDailyData.date));
				const dailyDataCache = this.personalAccountCacheService.getPersonalAccountDailyDataFromCache({
					year,
					month,
				});

				// subtract old data from aggregations
				this.personalAccountDataAggregatorService.updateAggregations(removedDailyData, 'decrease');

				// add new data to aggregations
				this.personalAccountDataAggregatorService.updateAggregations(addedDailyData, 'increase');

				// remove from cache
				this.personalAccountCacheService.removePersonalAccountDailyDataFromCache(removedDailyData.id);

				// if daily data is loaded, add this on too sorted
				if (dailyDataCache) {
					// filter out removed data from array
					const removedOldDailyData = dailyDataCache.filter((d) => d.id !== removedDailyData.id);
					// update cash with new data
					this.personalAccountCacheService.updatePersonalAccountDailyDataCache(
						[...removedOldDailyData, addedDailyData],
						{
							year,
							month,
						}
					);
				}
			})
		);
	}

	deletePersonalAccountDailyEntry(
		input: PersonalAccountDailyDataDelete
	): Observable<PersonalAccountDailyDataOutputFragment | undefined> {
		return this.personalAccountApiService.deletePersonalAccountDailyEntry(input).pipe(
			tap((entry) => {
				if (!entry) {
					return;
				}

				// update yearly, monthly, weekly aggregation
				this.personalAccountDataAggregatorService.updateAggregations(entry, 'decrease');

				// remove from cache
				this.personalAccountCacheService.removePersonalAccountDailyDataFromCache(entry.id);
			})
		);
	}
}

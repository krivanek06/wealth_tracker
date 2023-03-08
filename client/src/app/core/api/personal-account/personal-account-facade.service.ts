import { Injectable } from '@angular/core';
import { FetchResult } from '@apollo/client/core';
import { map, Observable, tap } from 'rxjs';
import {
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
		private personalAccountCacheService: PersonalAccountCacheService
	) {}

	getPersonalAccounts(): Observable<PersonalAccountOverviewFragment[]> {
		return this.personalAccountApiService.getPersonalAccounts();
	}

	getPersonalAccountAvailableTagImages(): Observable<string[]> {
		return this.personalAccountApiService.getPersonalAccountAvailableTagImages();
	}

	getPersonalAccountDetailsById(input: string): Observable<PersonalAccountDetailsFragment> {
		return this.personalAccountApiService.getPersonalAccountDetailsById(input);
	}

	getPersonalAccountTagFromCache(tagId: string): PersonalAccountTagFragment | null {
		return this.personalAccountCacheService.getPersonalAccountTagFromCache(tagId);
	}

	createPersonalAccount(name: string): Observable<PersonalAccountOverviewFragment | undefined> {
		return this.personalAccountApiService.createPersonalAccount(name).pipe(
			tap((result) => {
				if (!result) {
					return;
				}

				const accounts = this.personalAccountCacheService.getPersonalAccountsOverview();

				// update cache
				this.personalAccountCacheService.updatePersonalAccountsOverview([...accounts, result]);
			})
		);
	}

	editPersonalAccount(input: PersonalAccountEditInput): Observable<FetchResult<EditPersonalAccountMutation>> {
		return this.personalAccountApiService.editPersonalAccount(input);
	}

	deletePersonalAccount(accountId: string): Observable<PersonalAccountOverviewFragment | undefined> {
		return this.personalAccountApiService.deletePersonalAccount(accountId).pipe(
			tap((res) => {
				// load accounts from cache
				const accounts = this.personalAccountCacheService.getPersonalAccountsOverview();
				const updatedAccounts = accounts.filter((d) => d.id !== accountId);

				// update cache
				this.personalAccountCacheService.updatePersonalAccountsOverview([...updatedAccounts]);
			})
		);
	}

	getPersonalAccountTags(accountId: string): Observable<PersonalAccountTag[]> {
		return this.getPersonalAccountDetailsById(accountId).pipe(map((account) => account.personalAccountTag));
	}

	getPersonalAccountTagsExpense(accountId: string): Observable<PersonalAccountTag[]> {
		return this.getPersonalAccountTags(accountId).pipe(
			map((tags) => tags.filter((d) => d.type === TagDataType.Expense))
		);
	}

	getPersonalTagsIncome(accountId: string): Observable<PersonalAccountTag[]> {
		return this.getPersonalAccountTags(accountId).pipe(
			map((tags) => tags.filter((d) => d.type === TagDataType.Income))
		);
	}

	/**
	 *
	 * @param personalAccountId
	 * @param dateFormat - year-month-week
	 * @returns
	 */
	getPersonalAccountDailyData(
		personalAccountId: string,
		dateFormat: string
	): Observable<PersonalAccountDailyDataOutputFragment[]> {
		const [year, month, week] = dateFormat.split('-').map((d) => Number(d));

		return this.personalAccountApiService
			.getPersonalAccountDailyData({
				personalAccountId,
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

				const personalAccount = this.personalAccountCacheService.getPersonalAccountDetails(input.personalAccountId);

				this.personalAccountCacheService.updatePersonalAccountDetails(input.personalAccountId, {
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

				const personalAccount = this.personalAccountCacheService.getPersonalAccountDetails(input.personalAccountId);

				// remove tag from array in personal account
				this.personalAccountCacheService.updatePersonalAccountDetails(input.personalAccountId, {
					...personalAccount,
					personalAccountTag: personalAccount.personalAccountTag.filter((d) => d.id !== result.id),
				});

				// TODO: update charts - remove income/expenses on specific tag
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
				const personalAccountId = input.personalAccountId;

				// check if daily data for specific data is in cache, if so, add this one too
				const { year, month } = DateServiceUtil.getDetailsInformationFromDate(input.date);
				const dailyDataCache = this.personalAccountCacheService.getPersonalAccountDailyDataFromCache({
					personalAccountId,
					year,
					month,
				});

				// if daily data is loaded, add this on too sorted
				if (dailyDataCache) {
					this.personalAccountCacheService.updatePersonalAccountDailyDataCache([...dailyDataCache, entry], {
						personalAccountId,
						year,
						month,
					});
				}

				// update yearly, monthly, weekly aggregation
				this.personalAccountDataAggregatorService.updateAggregations(input.personalAccountId, entry, 'increase');
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
					personalAccountId: addedDailyData.personalAccountId,
					year,
					month,
				});

				// subtract old data from aggregations
				this.personalAccountDataAggregatorService.updateAggregations(
					input.dailyDataDelete.personalAccountId,
					removedDailyData,
					'decrease'
				);

				// add new data to aggregations
				this.personalAccountDataAggregatorService.updateAggregations(
					input.dailyDataDelete.personalAccountId,
					addedDailyData,
					'increase'
				);

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
							personalAccountId: addedDailyData.personalAccountId,
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
				this.personalAccountDataAggregatorService.updateAggregations(input.personalAccountId, entry, 'decrease');

				// remove from cache
				this.personalAccountCacheService.removePersonalAccountDailyDataFromCache(entry.id);
			})
		);
	}
}

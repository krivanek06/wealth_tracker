import { Injectable } from '@angular/core';
import { FetchResult } from '@apollo/client/core';
import { map, Observable, tap } from 'rxjs';
import {
	CreatePersonalAccountMutation,
	DeletePersonalAccountMutation,
	EditPersonalAccountMutation,
	PersonalAccountDailyDataCreate,
	PersonalAccountDailyDataDelete,
	PersonalAccountDailyDataEdit,
	PersonalAccountDailyDataEditOutput,
	PersonalAccountDailyDataOutputFragment,
	PersonalAccountDetailsFragment,
	PersonalAccountEditInput,
	PersonalAccountMonthlyDataDetailFragment,
	PersonalAccountOverviewFragment,
	PersonalAccountTag,
	PersonalAccountTagFragment,
	TagDataType,
} from '../../graphql';
import { PersonalAccountApiService } from './personal-account-api.service';
import { PersonalAccountCacheService } from './personal-account-cache.service';
import { PersonalAccountDataAggregatorService } from './personal-account-data-aggregator.service';
import { PersonalAccountMonthlyDataService } from './personal-account-monthly-data.service';

@Injectable({
	providedIn: 'root',
})
export class PersonalAccountFacadeService {
	constructor(
		private personalAccountApiService: PersonalAccountApiService,
		private personalAccountDataAggregatorService: PersonalAccountDataAggregatorService,
		private personalAccountMonthlyDataService: PersonalAccountMonthlyDataService,
		private personalAccountCacheService: PersonalAccountCacheService
	) {}

	getPersonalAccounts(): Observable<PersonalAccountOverviewFragment[]> {
		return this.personalAccountApiService.getPersonalAccounts();
	}

	getPersonalAccountDetailsById(input: string): Observable<PersonalAccountDetailsFragment> {
		return this.personalAccountApiService.getPersonalAccountDetailsById(input);
	}

	getPersonalAccountTagFromCache(tagId: string): PersonalAccountTagFragment | null {
		return this.personalAccountCacheService.getPersonalAccountTagFromCache(tagId);
	}

	createPersonalAccount(name: string): Observable<FetchResult<CreatePersonalAccountMutation>> {
		return this.personalAccountApiService.createPersonalAccount(name);
	}

	editPersonalAccount(input: PersonalAccountEditInput): Observable<FetchResult<EditPersonalAccountMutation>> {
		return this.personalAccountApiService.editPersonalAccount(input);
	}

	deletePersonalAccount(accountId: string): Observable<FetchResult<DeletePersonalAccountMutation>> {
		return this.personalAccountApiService.deletePersonalAccount(accountId);
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
	createPersonalAccountDailyEntry(
		input: PersonalAccountDailyDataCreate
	): Observable<PersonalAccountDailyDataOutputFragment | undefined> {
		return this.personalAccountApiService.createPersonalAccountDailyEntry(input).pipe(
			tap((entry) => {
				if (!entry) {
					return;
				}

				// update yearly, monthly, weekly aggregation
				this.personalAccountDataAggregatorService.updateAggregations(input.personalAccountId, entry, 'increase');

				// add daily data into monthly details
				this.personalAccountMonthlyDataService.updateMonthlyDailyData(entry, 'add');
			})
		);
	}

	editPersonalAccountDailyEntry(input: PersonalAccountDailyDataEdit): Observable<PersonalAccountDailyDataEditOutput> {
		return this.personalAccountApiService.editPersonalAccountDailyEntry(input).pipe(
			tap((entry) => {
				const removedDailyData = entry.originalDailyData as PersonalAccountDailyDataOutputFragment;
				const addedDailyData = entry.modifiedDailyData as PersonalAccountDailyDataOutputFragment;

				// subtract old data
				this.personalAccountDataAggregatorService.updateAggregations(
					input.dailyDataDelete.personalAccountId,
					removedDailyData,
					'decrease'
				);
				this.personalAccountMonthlyDataService.updateMonthlyDailyData(removedDailyData, 'remove');

				// add new data
				this.personalAccountDataAggregatorService.updateAggregations(
					input.dailyDataDelete.personalAccountId,
					addedDailyData,
					'increase'
				);
				this.personalAccountMonthlyDataService.updateMonthlyDailyData(addedDailyData, 'add');

				// remove from cache
				this.personalAccountCacheService.removePersonalAccountDailyDataFromCache(removedDailyData.id);
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

				// add daily data into monthly details
				this.personalAccountMonthlyDataService.updateMonthlyDailyData(entry, 'remove');

				// remove from cache
				this.personalAccountCacheService.removePersonalAccountDailyDataFromCache(entry.id);
			})
		);
	}

	getPersonalAccountMonthlyDataById(monthlyDataId: string): Observable<PersonalAccountMonthlyDataDetailFragment> {
		return this.personalAccountMonthlyDataService.getPersonalAccountMonthlyDataById(monthlyDataId);
	}

	/**
	 * Persist daily data into monthly.dailyData array
	 * if monthly data not loaded, skip the operation, daily data will be loaded by getPersonalAccountMonthlyDataById
	 *
	 * @param dailyData
	 * @param operation
	 * @returns
	 */
	updateMonthlyDailyData(dailyData: PersonalAccountDailyDataOutputFragment, operation: 'add' | 'remove'): void {
		this.personalAccountMonthlyDataService.updateMonthlyDailyData(dailyData, operation);
	}
}

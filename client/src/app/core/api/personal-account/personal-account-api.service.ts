import { Injectable } from '@angular/core';
import { DataProxy, FetchResult } from '@apollo/client/core';
import { map, Observable } from 'rxjs';
import {
	CreatePersonalAccountDailyEntryGQL,
	CreatePersonalAccountGQL,
	CreatePersonalAccountMutation,
	DeletePersonalAccountDailyEntryGQL,
	DeletePersonalAccountGQL,
	DeletePersonalAccountMutation,
	EditPersonalAccountDailyEntryGQL,
	EditPersonalAccountGQL,
	EditPersonalAccountMutation,
	GetPersonalAccountByIdGQL,
	GetPersonalAccountDailyDataGQL,
	GetPersonalAccountsDocument,
	GetPersonalAccountsGQL,
	GetPersonalAccountsQuery,
	PersonalAccountDailyDataCreate,
	PersonalAccountDailyDataDelete,
	PersonalAccountDailyDataEdit,
	PersonalAccountDailyDataEditOutput,
	PersonalAccountDailyDataOutputFragment,
	PersonalAccountDailyDataQuery,
	PersonalAccountDetailsFragment,
	PersonalAccountEditInput,
	PersonalAccountOverviewFragment,
} from '../../graphql';
import { PersonalAccountCacheService } from './personal-account-cache.service';

@Injectable({
	providedIn: 'root',
})
export class PersonalAccountApiService {
	constructor(
		private getPersonalAccountsGQL: GetPersonalAccountsGQL,
		private getPersonalAccountByIdGQL: GetPersonalAccountByIdGQL,
		private createPersonalAccountGQL: CreatePersonalAccountGQL,
		private editPersonalAccountGQL: EditPersonalAccountGQL,
		private deletePersonalAccountGQL: DeletePersonalAccountGQL,
		private createPersonalAccountDailyEntryGQL: CreatePersonalAccountDailyEntryGQL,
		private editPersonalAccountDailyEntryGQL: EditPersonalAccountDailyEntryGQL,
		private deletePersonalAccountDailyEntryGQL: DeletePersonalAccountDailyEntryGQL,
		private getPersonalAccountDailyDataGQL: GetPersonalAccountDailyDataGQL,
		private personalAccountCacheService: PersonalAccountCacheService
	) {}

	getPersonalAccounts(): Observable<PersonalAccountOverviewFragment[]> {
		return this.getPersonalAccountsGQL.watch().valueChanges.pipe(map((res) => res.data.getPersonalAccounts));
	}

	getPersonalAccountDetailsById(input: string): Observable<PersonalAccountDetailsFragment> {
		return this.getPersonalAccountByIdGQL
			.watch({
				input,
			})
			.valueChanges.pipe(map((res) => res.data.getPersonalAccountById));
	}

	createPersonalAccount(name: string): Observable<FetchResult<CreatePersonalAccountMutation>> {
		return this.createPersonalAccountGQL.mutate(
			{
				name,
			},
			{
				update: (store: DataProxy, { data }) => {
					const result = data?.createPersonalAccount as PersonalAccountOverviewFragment;

					// query movies from cache
					const query = store.readQuery<GetPersonalAccountsQuery>({
						query: GetPersonalAccountsDocument,
					});

					// no data in cache
					if (!query?.getPersonalAccounts) {
						return;
					}

					// update cache
					this.personalAccountCacheService.updatePersonalAccountsOverview([...query.getPersonalAccounts, result]);
				},
			}
		);
	}

	editPersonalAccount(input: PersonalAccountEditInput): Observable<FetchResult<EditPersonalAccountMutation>> {
		return this.editPersonalAccountGQL.mutate({
			input,
		});
	}

	deletePersonalAccount(accountId: string): Observable<FetchResult<DeletePersonalAccountMutation>> {
		return this.deletePersonalAccountGQL.mutate(
			{
				accountId,
			},
			{
				update: (store: DataProxy, { data }) => {
					// load accounts from cache
					const accounts = this.personalAccountCacheService.getPersonalAccountsOverview();
					const updatedAccounts = accounts.filter((d) => d.id !== accountId);

					// update cache
					this.personalAccountCacheService.updatePersonalAccountsOverview([...updatedAccounts]);

					// remove from cache - TODO: gives error
					// this.personalAccountCacheService.removePersonalAccountFromCache(accountId);
				},
			}
		);
	}

	createPersonalAccountDailyEntry(
		input: PersonalAccountDailyDataCreate
	): Observable<PersonalAccountDailyDataOutputFragment | undefined> {
		return this.createPersonalAccountDailyEntryGQL
			.mutate({
				input,
			})
			.pipe(map((res) => res.data?.createPersonalAccountDailyEntry));
	}

	editPersonalAccountDailyEntry(input: PersonalAccountDailyDataEdit): Observable<PersonalAccountDailyDataEditOutput> {
		return this.editPersonalAccountDailyEntryGQL
			.mutate({
				input,
			})
			.pipe(map((res) => res.data?.editPersonalAccountDailyEntry as PersonalAccountDailyDataEditOutput));
	}

	deletePersonalAccountDailyEntry(
		input: PersonalAccountDailyDataDelete
	): Observable<PersonalAccountDailyDataOutputFragment | undefined> {
		return this.deletePersonalAccountDailyEntryGQL
			.mutate({
				input,
			})
			.pipe(map((res) => res.data?.deletePersonalAccountDailyEntry));
	}

	getPersonalAccountDailyData(
		input: PersonalAccountDailyDataQuery
	): Observable<PersonalAccountDailyDataOutputFragment[]> {
		return this.getPersonalAccountDailyDataGQL
			.watch({
				input,
			})
			.valueChanges.pipe(map((res) => res.data.getPersonalAccountDailyData));
	}
}

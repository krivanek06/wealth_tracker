import { Injectable } from '@angular/core';
import { DataProxy, FetchResult } from '@apollo/client/core';
import { first, map, Observable } from 'rxjs';
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
	GetDefaultTagsGQL,
	GetPersonalAccountByIdGQL,
	GetPersonalAccountsDocument,
	GetPersonalAccountsGQL,
	GetPersonalAccountsQuery,
	PersonalAccountDailyDataCreate,
	PersonalAccountDailyDataDelete,
	PersonalAccountDailyDataEdit,
	PersonalAccountDailyDataEditOutput,
	PersonalAccountDailyDataFragment,
	PersonalAccountEditInput,
	PersonalAccountOverviewBasicFragment,
	PersonalAccountOverviewFragment,
	PersonalAccountTag,
	TagDataType,
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
		private getDefaultTagsGQL: GetDefaultTagsGQL,
		private createPersonalAccountDailyEntryGQL: CreatePersonalAccountDailyEntryGQL,
		private editPersonalAccountDailyEntryGQL: EditPersonalAccountDailyEntryGQL,
		private deletePersonalAccountDailyEntryGQL: DeletePersonalAccountDailyEntryGQL,
		private personalAccountCacheService: PersonalAccountCacheService
	) {
		this.getDefaultTags().pipe(first()).subscribe();
	}

	getPersonalAccounts(): Observable<PersonalAccountOverviewBasicFragment[]> {
		return this.getPersonalAccountsGQL.watch().valueChanges.pipe(map((res) => res.data.getPersonalAccounts));
	}

	getPersonalAccountOverviewById(input: string): Observable<PersonalAccountOverviewFragment> {
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
					this.personalAccountCacheService.updatePersonalAccountsBasic([...query.getPersonalAccounts, result]);
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
					const accounts = this.personalAccountCacheService.getPersonalAccountOverviewBasic();
					const updatedAccounts = accounts.filter((d) => d.id !== accountId);

					// update cache
					this.personalAccountCacheService.updatePersonalAccountsBasic([...updatedAccounts]);

					// remove from cache - TODO: gives error
					// this.personalAccountCacheService.removePersonalAccountFromCache(accountId);
				},
			}
		);
	}

	getDefaultTags(): Observable<PersonalAccountTag[]> {
		return this.getDefaultTagsGQL.watch().valueChanges.pipe(map((res) => res.data.getDefaultTags));
	}

	getDefaultTagsExpense(): Observable<PersonalAccountTag[]> {
		return this.getDefaultTags().pipe(map((tags) => tags.filter((t) => t.type === TagDataType.Expense)));
	}

	getDefaultTagsIncome(): Observable<PersonalAccountTag[]> {
		return this.getDefaultTags().pipe(map((tags) => tags.filter((t) => t.type === TagDataType.Income)));
	}

	createPersonalAccountDailyEntry(input: PersonalAccountDailyDataCreate): Observable<PersonalAccountDailyDataFragment> {
		return this.createPersonalAccountDailyEntryGQL
			.mutate({
				input,
			})
			.pipe(map((res) => res.data?.createPersonalAccountDailyEntry as PersonalAccountDailyDataFragment));
	}

	editPersonalAccountDailyEntry(input: PersonalAccountDailyDataEdit): Observable<PersonalAccountDailyDataEditOutput> {
		return this.editPersonalAccountDailyEntryGQL
			.mutate({
				input,
			})
			.pipe(map((res) => res.data?.editPersonalAccountDailyEntry as PersonalAccountDailyDataEditOutput));
	}

	deletePersonalAccountDailyEntry(input: PersonalAccountDailyDataDelete): Observable<PersonalAccountDailyDataFragment> {
		return this.deletePersonalAccountDailyEntryGQL
			.mutate({
				input,
			})
			.pipe(map((res) => res.data?.deletePersonalAccountDailyEntry as PersonalAccountDailyDataFragment));
	}
}

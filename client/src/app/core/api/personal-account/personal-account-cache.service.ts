import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import {
	GetPersonalAccountDailyDataDocument,
	GetPersonalAccountDailyDataQuery,
	GetPersonalAccountsDocument,
	GetPersonalAccountsQuery,
	PersonalAccountDailyDataOutputFragment,
	PersonalAccountDailyDataQuery,
	PersonalAccountDetailsFragment,
	PersonalAccountDetailsFragmentDoc,
	PersonalAccountOverviewFragment,
	PersonalAccountTagFragment,
	PersonalAccountTagFragmentDoc,
} from '../../graphql';

@Injectable({
	providedIn: 'root',
})
export class PersonalAccountCacheService {
	constructor(private apollo: Apollo) {}

	getPersonalAccountDailyDataFromCache(
		input: PersonalAccountDailyDataQuery
	): PersonalAccountDailyDataOutputFragment[] | undefined {
		const query = this.apollo.client.readQuery<GetPersonalAccountDailyDataQuery>({
			query: GetPersonalAccountDailyDataDocument,
			variables: {
				input,
			},
		});

		return query?.getPersonalAccountDailyData;
	}

	updatePersonalAccountDailyDataCache(
		data: PersonalAccountDailyDataOutputFragment[],
		input: PersonalAccountDailyDataQuery
	): void {
		this.apollo.client.writeQuery<GetPersonalAccountDailyDataQuery>({
			query: GetPersonalAccountDailyDataDocument,
			variables: {
				input,
			},
			data: {
				__typename: 'Query',
				getPersonalAccountDailyData: data,
			},
		});
	}

	getPersonalAccountTagFromCache(tagId: string): PersonalAccountTagFragment | null {
		const fragment = this.apollo.client.readFragment<PersonalAccountTagFragment>({
			id: `PersonalAccountTag:${tagId}`,
			fragmentName: 'PersonalAccountTag',
			fragment: PersonalAccountTagFragmentDoc,
		});
		return fragment;
	}

	getPersonalAccountsOverview(): PersonalAccountOverviewFragment[] {
		const query = this.apollo.client.readQuery<GetPersonalAccountsQuery>({
			query: GetPersonalAccountsDocument,
		});

		return query?.getPersonalAccounts ?? [];
	}

	updatePersonalAccountsOverview(data: PersonalAccountOverviewFragment[]): void {
		this.apollo.client.writeQuery<GetPersonalAccountsQuery>({
			query: GetPersonalAccountsDocument,
			data: {
				__typename: 'Query',
				getPersonalAccounts: [...data],
			},
		});
	}

	getPersonalAccountDetails(personalAccountId: string): PersonalAccountDetailsFragment {
		const fragment = this.apollo.client.readFragment<PersonalAccountDetailsFragment>({
			id: `PersonalAccount:${personalAccountId}`,
			fragmentName: 'PersonalAccountDetails',
			fragment: PersonalAccountDetailsFragmentDoc,
		});

		// not found - personal account must be in cache
		if (!fragment) {
			throw new Error(`[PersonalAccountApiService]: Unable to find the correct personal account details`);
		}

		return fragment;
	}

	updatePersonalAccountDetails(accountId: string, data: PersonalAccountDetailsFragment): void {
		this.apollo.client.writeFragment<PersonalAccountDetailsFragment>({
			id: `PersonalAccount:${accountId}`,
			fragmentName: 'PersonalAccountDetails',
			fragment: PersonalAccountDetailsFragmentDoc,
			data: {
				...data,
			},
		});
	}

	removePersonalAccountDailyDataFromCache(accountId: string): void {
		this.apollo.client.cache.evict({ id: `PersonalAccountDailyDataOutput:${accountId}` });
		this.apollo.client.cache.gc();
	}

	removePersonalAccountFromCache(accountId: string): void {
		this.apollo.client.cache.evict({ id: `PersonalAccount:${accountId}` });
		this.apollo.client.cache.gc();
	}
}

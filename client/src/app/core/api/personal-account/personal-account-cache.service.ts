import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import {
	GetPersonalAccountByUserDocument,
	GetPersonalAccountByUserQuery,
	GetPersonalAccountDailyDataDocument,
	GetPersonalAccountDailyDataQuery,
	PersonalAccountDailyDataOutputFragment,
	PersonalAccountDailyDataQuery,
	PersonalAccountDetailsFragment,
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

	getPersonalAccountDetails(): PersonalAccountDetailsFragment {
		const fragment = this.apollo.client.readQuery<GetPersonalAccountByUserQuery>({
			query: GetPersonalAccountByUserDocument,
		});

		// not found - personal account must be in cache
		if (!fragment?.getPersonalAccountByUser) {
			throw new Error(`[PersonalAccountApiService]: Unable to find the correct personal account details`);
		}

		return fragment.getPersonalAccountByUser;
	}

	updatePersonalAccountDetails(data: PersonalAccountDetailsFragment): void {
		this.apollo.client.writeQuery<GetPersonalAccountByUserQuery>({
			query: GetPersonalAccountByUserDocument,
			data: {
				__typename: 'Query',
				getPersonalAccountByUser: {
					__typename: 'PersonalAccount',
					...data,
				},
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

	removePersonalAccountTagFromCache(tagId: string): void {
		this.apollo.client.cache.evict({ id: `PersonalAccountTag:${tagId}` });
		this.apollo.client.cache.gc();
	}
}

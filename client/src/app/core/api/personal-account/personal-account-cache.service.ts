import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import {
	GetDefaultTagsDocument,
	GetDefaultTagsQuery,
	GetPersonalAccountMonthlyDataByIdDocument,
	GetPersonalAccountMonthlyDataByIdQuery,
	GetPersonalAccountsDocument,
	GetPersonalAccountsQuery,
	PersonalAccountMonthlyDataDetailFragment,
	PersonalAccountMonthlyDataDetailFragmentDoc,
	PersonalAccountMonthlyDataOverviewFragment,
	PersonalAccountMonthlyDataOverviewFragmentDoc,
	PersonalAccountOverviewBasicFragment,
	PersonalAccountOverviewFragment,
	PersonalAccountOverviewFragmentDoc,
	PersonalAccountTag,
} from '../../graphql';

@Injectable({
	providedIn: 'root',
})
export class PersonalAccountCacheService {
	constructor(private apollo: Apollo) {}

	get defaultTagsFromCache(): PersonalAccountTag[] {
		const query = this.apollo.client.readQuery<GetDefaultTagsQuery>({
			query: GetDefaultTagsDocument,
		});

		return query?.getDefaultTags ?? [];
	}

	getPersonalAccountMonthlyDataByIdFromCache(monthlyDataId?: string): PersonalAccountMonthlyDataDetailFragment | null {
		if (!monthlyDataId) {
			return null;
		}

		const fragment = this.apollo.client.readFragment<PersonalAccountMonthlyDataDetailFragment>({
			id: `PersonalAccountMonthlyData:${monthlyDataId}`,
			fragmentName: 'PersonalAccountMonthlyDataDetail',
			fragment: PersonalAccountMonthlyDataDetailFragmentDoc,
			variables: {
				input: monthlyDataId,
			},
		});
		return fragment;
	}

	getPersonalAccountOverviewBasic(): PersonalAccountOverviewBasicFragment[] {
		const query = this.apollo.client.readQuery<GetPersonalAccountsQuery>({
			query: GetPersonalAccountsDocument,
		});

		return query?.getPersonalAccounts ?? [];
	}

	updatePersonalAccountsBasic(data: PersonalAccountOverviewBasicFragment[]): void {
		this.apollo.client.writeQuery<GetPersonalAccountsQuery>({
			query: GetPersonalAccountsDocument,
			data: {
				__typename: 'Query',
				getPersonalAccounts: [...data],
			},
		});
	}

	getPersonalAccountMonthlyDataOverviewFromCache(monthlyDataId: string): PersonalAccountMonthlyDataOverviewFragment {
		const fragment = this.apollo.client.readFragment<PersonalAccountMonthlyDataOverviewFragment>({
			id: `PersonalAccountMonthlyData:${monthlyDataId}`,
			fragmentName: 'PersonalAccountMonthlyDataOverview',
			fragment: PersonalAccountMonthlyDataOverviewFragmentDoc,
		});

		if (!fragment) {
			throw new Error('Personal account monthly overview not found');
		}

		return fragment;
	}

	getPersonalAccountOverview(personalAccountId: string): PersonalAccountOverviewFragment {
		const fragment = this.apollo.client.readFragment<PersonalAccountOverviewFragment>({
			id: `PersonalAccount:${personalAccountId}`,
			fragmentName: 'PersonalAccountOverview',
			fragment: PersonalAccountOverviewFragmentDoc,
		});

		// not found - personal account must be in cache
		if (!fragment) {
			throw new Error(`[PersonalAccountApiService]: Unable to find the correct personal account`);
		}

		return fragment;
	}

	updatePersonalAccountOverview(accountId: string, data: PersonalAccountOverviewFragment): void {
		this.apollo.client.writeFragment<PersonalAccountOverviewFragment>({
			id: `PersonalAccount:${accountId}`,
			fragmentName: 'PersonalAccountOverview',
			fragment: PersonalAccountOverviewFragmentDoc,
			data: {
				...data,
			},
		});
	}

	updatePersonalAccountMonthly(accountId: string, data: PersonalAccountMonthlyDataDetailFragment) {
		this.apollo.client.writeQuery<GetPersonalAccountMonthlyDataByIdQuery>({
			variables: {
				input: accountId,
			},
			query: GetPersonalAccountMonthlyDataByIdDocument,
			data: {
				__typename: 'Query',
				getPersonalAccountMonthlyDataById: {
					...data,
				},
			},
		});
	}

	removePersonalAccountDailyDataFromCache(accountId: string): void {
		this.apollo.client.cache.evict({ id: `PersonalAccountDailyData:${accountId}` });
		this.apollo.client.cache.gc();
	}

	removePersonalAccountFromCache(accountId: string): void {
		this.apollo.client.cache.evict({ id: `PersonalAccount:${accountId}` });
		this.apollo.client.cache.gc();
	}
}

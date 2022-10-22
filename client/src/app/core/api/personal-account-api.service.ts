import { Injectable } from '@angular/core';
import { DataProxy, FetchResult } from '@apollo/client/core';
import { Apollo } from 'apollo-angular';
import { map, Observable } from 'rxjs';
import { MomentServiceUtil } from './../../shared/utils';
import {
	CreatePersonalAccountDailyEntryGQL,
	CreatePersonalAccountDailyEntryMutation,
	CreatePersonalAccountGQL,
	CreatePersonalAccountMutation,
	DeletePersonalAccountDailyEntryGQL,
	DeletePersonalAccountDailyEntryMutation,
	DeletePersonalAccountGQL,
	DeletePersonalAccountMutation,
	EditPersonalAccountDailyEntryGQL,
	EditPersonalAccountDailyEntryMutation,
	EditPersonalAccountGQL,
	EditPersonalAccountMutation,
	GetDefaultTagsDocument,
	GetDefaultTagsGQL,
	GetDefaultTagsQuery,
	GetPersonalAccountMonthlyDataByIdDocument,
	GetPersonalAccountMonthlyDataByIdGQL,
	GetPersonalAccountMonthlyDataByIdQuery,
	GetPersonalAccountsDocument,
	GetPersonalAccountsGQL,
	GetPersonalAccountsQuery,
	PersonalAccountDailyDataCreate,
	PersonalAccountDailyDataDelete,
	PersonalAccountDailyDataEdit,
	PersonalAccountDailyDataFragment,
	PersonalAccountEditInput,
	PersonalAccountMonthlyDataDetailFragment,
	PersonalAccountMonthlyDataOverviewFragment,
	PersonalAccountMonthlyDataOverviewFragmentDoc,
	PersonalAccountOverviewFragment,
	PersonalAccountTag,
	TagDataType,
} from './../graphql';

@Injectable({
	providedIn: 'root',
})
export class PersonalAccountApiService {
	constructor(
		private getPersonalAccountsGQL: GetPersonalAccountsGQL,
		private createPersonalAccountGQL: CreatePersonalAccountGQL,
		private editPersonalAccountGQL: EditPersonalAccountGQL,
		private deletePersonalAccountGQL: DeletePersonalAccountGQL,
		private getDefaultTagsGQL: GetDefaultTagsGQL,
		private getPersonalAccountMonthlyDataByIdGQL: GetPersonalAccountMonthlyDataByIdGQL,
		private createPersonalAccountDailyEntryGQL: CreatePersonalAccountDailyEntryGQL,
		private editPersonalAccountDailyEntryGQL: EditPersonalAccountDailyEntryGQL,
		private deletePersonalAccountDailyEntryGQL: DeletePersonalAccountDailyEntryGQL,
		private apollo: Apollo
	) {
		// TODO: load tags &&& personalAccount outside this service
		// this.getDefaultTags().pipe(first()).subscribe();
	}

	/* ========= READING FROM CACHE ========= */

	get defaultTagsFromCache(): PersonalAccountTag[] {
		const query = this.apollo.client.readQuery<GetDefaultTagsQuery>({
			query: GetDefaultTagsDocument,
		});

		return query?.getDefaultTags ?? [];
	}

	getPersonalAccountMonthlyDataByIdFromCache(monthlyDataId: string): PersonalAccountMonthlyDataDetailFragment | null {
		const fragment = this.apollo.client.readFragment<PersonalAccountMonthlyDataDetailFragment>({
			id: `PersonalAccountMonthlyData:${monthlyDataId}`,
			fragmentName: 'PersonalAccountMonthlyDataDetail',
			fragment: GetPersonalAccountMonthlyDataByIdDocument,
			variables: {
				input: monthlyDataId,
			},
		});
		return fragment;
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

	getDefaultTagsFromCache(tagId: string): PersonalAccountTag {
		const tag = this.defaultTagsFromCache.find((t) => t.id == tagId);
		if (!tag) {
			throw new Error('Unable to find the correct tag');
		}
		return tag;
	}

	getPersonalAccountFromCachce(personalAccountId: string): PersonalAccountOverviewFragment {
		const fragment = this.apollo.client.readFragment<PersonalAccountOverviewFragment>({
			id: `PersonalAccount:${personalAccountId}`,
			fragmentName: 'PersonalAccountOverview',
			fragment: GetPersonalAccountsDocument,
		});

		// not found - personal account must be in cache
		if (!fragment) {
			throw new Error(`Unable to find the correct personal account`);
		}

		return fragment;
	}

	getMonthlyDataOverviewFromCache(personalAccountId: string, date: string): PersonalAccountMonthlyDataOverviewFragment {
		const { year, month, week } = MomentServiceUtil.getDetailsInformationFromDate(date);

		// load personal account from cache
		const personalAccount = this.getPersonalAccountFromCachce(personalAccountId);

		// get monthly data from personal account
		const monthlyData = personalAccount.monthlyData.find((d) => d.year === year && d.month === month);

		if (!monthlyData) {
			throw new Error(`Unable to find the correct monthly data`);
		}

		return monthlyData;
	}

	/* ========= READING FROM API ========= */

	getPersonalAccounts(): Observable<PersonalAccountOverviewFragment[]> {
		return this.getPersonalAccountsGQL.watch().valueChanges.pipe(map((res) => res.data.getPersonalAccounts));
	}

	createPersonalAccount(name: string): Observable<FetchResult<CreatePersonalAccountMutation>> {
		return this.createPersonalAccountGQL.mutate(
			{
				name,
			},
			{
				optimisticResponse: {
					__typename: 'Mutation',
					createPersonalAccount: {
						__typename: 'PersonalAccount',
						name,
						createdAt: new Date().toDateString(),
						id: 'account-1234',
						userId: 'user-1234',
						monthlyData: [],
						weeklyAggregaton: [],
						yearlyAggregaton: [],
					},
				},
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
					store.writeQuery<GetPersonalAccountsQuery>({
						query: GetPersonalAccountsDocument,
						data: {
							__typename: 'Query',
							getPersonalAccounts: [...query.getPersonalAccounts, result],
						},
					});
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
					this.apollo.client.cache.evict({ id: `${data?.__typename}:${data?.deletePersonalAccount}` });
				},
			}
		);
	}

	getDefaultTags(): Observable<PersonalAccountTag[]> {
		return this.getDefaultTagsGQL.watch().valueChanges.pipe(map((res) => res.data.getDefaultTags));
	}

	getPersonalAccountMonthlyDataById(monthlyDataId: string): Observable<PersonalAccountMonthlyDataDetailFragment> {
		return this.getPersonalAccountMonthlyDataByIdGQL
			.watch({
				input: monthlyDataId,
			})
			.valueChanges.pipe(map((res) => res.data.getPersonalAccountMonthlyDataById));
	}

	createPersonalAccountDailyEntry(
		input: PersonalAccountDailyDataCreate
	): Observable<FetchResult<CreatePersonalAccountDailyEntryMutation>> {
		const { week } = MomentServiceUtil.getDetailsInformationFromDate(input.date);
		const tag = this.getDefaultTagsFromCache(input.tagId);
		const monthlyData = this.getMonthlyDataOverviewFromCache(input.personalAccountId, input.date);

		return this.createPersonalAccountDailyEntryGQL.mutate(
			{
				input,
			},
			{
				optimisticResponse: {
					__typename: 'Mutation',
					createPersonalAccountDailyEntry: {
						__typename: 'PersonalAccountDailyData',
						id: new Date().toISOString(),
						date: new Date().toDateString(),
						monthlyDataId: monthlyData.id,
						tagId: input.tagId,
						value: input.value,
						week,
						tag: {
							...tag,
						},
					},
				},
				update: (store: DataProxy, { data }) => {
					const dailyData = data?.createPersonalAccountDailyEntry as PersonalAccountDailyDataFragment;
					// udpate yearly, monthly, weekly aggregation
					this.updateAggregations(input.personalAccountId, dailyData, 'increase');

					// add daily data into monthly details
					this.updateMonthlyDailyData(dailyData, 'add');
				},
			}
		);
	}

	editPersonalAccountDailyEntry(
		input: PersonalAccountDailyDataEdit
	): Observable<FetchResult<EditPersonalAccountDailyEntryMutation>> {
		return this.editPersonalAccountDailyEntryGQL.mutate(
			{
				input,
			},
			{
				update: (store: DataProxy, { data }) => {
					const result = data?.editPersonalAccountDailyEntry;
					const removedDailyData = result?.originalDailyData as PersonalAccountDailyDataFragment;
					const addedDailyData = result?.modifiedDailyData as PersonalAccountDailyDataFragment;

					// substract old data
					this.updateAggregations(input.dailyDataDelete.personalAccountId, removedDailyData, 'decrease');
					this.updateMonthlyDailyData(removedDailyData, 'remove');

					// add new data
					this.updateAggregations(input.dailyDataDelete.personalAccountId, addedDailyData, 'increase');
					this.updateMonthlyDailyData(addedDailyData, 'add');

					// remove from cache
					this.apollo.client.cache.evict({ id: `${removedDailyData?.__typename}:${removedDailyData?.id}` });
				},
			}
		);
	}

	deletePersonalAccountDailyEntry(
		input: PersonalAccountDailyDataDelete
	): Observable<FetchResult<DeletePersonalAccountDailyEntryMutation>> {
		return this.deletePersonalAccountDailyEntryGQL.mutate(
			{
				input,
			},
			{
				update: (store: DataProxy, { data }) => {
					const dailyData = data?.deletePersonalAccountDailyEntry as PersonalAccountDailyDataFragment;

					// udpate yearly, monthly, weekly aggregation
					this.updateAggregations(input.personalAccountId, dailyData, 'decrease');

					// add daily data into monthly details
					this.updateMonthlyDailyData(dailyData, 'remove');

					// remove from cache
					this.apollo.client.cache.evict({ id: `${dailyData?.__typename}:${dailyData?.id}` });
				},
			}
		);
	}

	private updateMonthlyDailyData(dailyData: PersonalAccountDailyDataFragment, operation: 'add' | 'remove'): void {
		const monthlyDetails = this.getPersonalAccountMonthlyDataByIdFromCache(dailyData.monthlyDataId);

		if (!monthlyDetails) {
			return;
		}

		// add or remove dailyData into array
		const updatedDailyData =
			operation === 'add'
				? [...monthlyDetails.dailyData, dailyData]
				: monthlyDetails.dailyData.filter((d) => d.id !== dailyData.id);

		this.apollo.client.writeQuery<GetPersonalAccountMonthlyDataByIdQuery>({
			variables: {
				input: monthlyDetails.id,
			},
			query: GetPersonalAccountMonthlyDataByIdDocument,
			data: {
				__typename: 'Query',
				getPersonalAccountMonthlyDataById: {
					...monthlyDetails,
					dailyData: updatedDailyData,
				},
			},
		});
	}

	private updateAggregations(
		personalAccountId: string,
		dailyData: PersonalAccountDailyDataFragment,
		operation: 'increase' | 'decrease'
	): void {
		const personalAccount = this.getPersonalAccountFromCachce(personalAccountId);
		const dateDetails = MomentServiceUtil.getDetailsInformationFromDate(dailyData.date);
		const multiplyer = operation === 'increase' ? 1 : -1;

		// update yearlyAggregaton that match tagId
		const yearlyAggregaton = personalAccount.yearlyAggregaton.map((data) => {
			if (data.tagId === dailyData.tagId) {
				return { ...data, value: data.value + dailyData.value * multiplyer, entries: data.entries + 1 * multiplyer };
			}
			return data;
		});

		// update weeklyAggregaton that match tagId and month & weej
		const weeklyAggregaton = personalAccount.weeklyAggregaton.map((data) => {
			// find specific week that needs to be updated
			if (data.year === dateDetails.year && data.month === dateDetails.month && data.week === dateDetails.week) {
				// update data in array that match tagId
				const weeklyAggregatonDailyData = data.data.map((d) => {
					if (d.tagId === dailyData.tagId) {
						return { ...d, entries: d.entries + 1 * multiplyer, value: d.value + dailyData.value * multiplyer };
					}

					// not upadted daily data
					return d;
				});
				// upadted weekly data
				return { ...data, data: weeklyAggregatonDailyData };
			}

			// not updated weekly data
			return data;
		});

		// update monthly data entries + income/expense
		const newMonthlyIncome = (dailyData.tag.type === TagDataType.Income ? dailyData.value : 0) * multiplyer;
		const newMonthlyExpense = (dailyData.tag.type === TagDataType.Expense ? dailyData.value : 0) * multiplyer;
		const monthlyData = personalAccount.monthlyData.map((d) => {
			if (d.id === dailyData.monthlyDataId) {
				return {
					...d,
					dailyEntries: d.dailyEntries + 1 * multiplyer,
					monthlyIncome: d.monthlyIncome + newMonthlyIncome,
					monthlyExpense: d.monthlyExpense + newMonthlyExpense,
				};
			}
			return d;
		});

		this.apollo.client.writeFragment<PersonalAccountOverviewFragment>({
			id: `PersonalAccount:${personalAccountId}`,
			fragmentName: 'PersonalAccountOverview',
			fragment: GetPersonalAccountsDocument,
			data: {
				...personalAccount,
				yearlyAggregaton,
				weeklyAggregaton,
				monthlyData,
			},
		});
	}
}

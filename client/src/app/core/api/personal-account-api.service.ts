import { Injectable } from '@angular/core';
import { DataProxy, FetchResult } from '@apollo/client/core';
import { Apollo } from 'apollo-angular';
import { first, map, Observable, tap } from 'rxjs';
import { DateServiceUtil } from './../../shared/utils';
import {
	CreatedMonthlyDataSubscriptionGQL,
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
	PersonalAccountMonthlyDataDetailFragmentDoc,
	PersonalAccountMonthlyDataOverviewFragment,
	PersonalAccountMonthlyDataOverviewFragmentDoc,
	PersonalAccountOverviewBasicFragment,
	PersonalAccountOverviewFragment,
	PersonalAccountOverviewFragmentDoc,
	PersonalAccountTag,
	TagDataType,
} from './../graphql';
import {
	GetPersonalAccountByIdGQL,
	PersonalAccountAggregationDataOutput,
	PersonalAccountWeeklyAggregationOutput,
} from './../graphql/schema-backend.service';

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
		private getPersonalAccountMonthlyDataByIdGQL: GetPersonalAccountMonthlyDataByIdGQL,
		private createPersonalAccountDailyEntryGQL: CreatePersonalAccountDailyEntryGQL,
		private editPersonalAccountDailyEntryGQL: EditPersonalAccountDailyEntryGQL,
		private deletePersonalAccountDailyEntryGQL: DeletePersonalAccountDailyEntryGQL,
		private createdMonthlyDataSubscriptionGQL: CreatedMonthlyDataSubscriptionGQL,
		private apollo: Apollo
	) {
		// TODO: load tags &&& personalAccount outside this service
		this.getDefaultTags().pipe(first()).subscribe();
		this.createdMonthlyDataSubscription().pipe().subscribe();
	}

	/* ========= READING FROM CACHE ========= */

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
			fragment: PersonalAccountOverviewFragmentDoc,
		});

		// not found - personal account must be in cache
		if (!fragment) {
			throw new Error(`[PersonalAccountApiService]: Unable to find the correct personal account`);
		}

		return fragment;
	}

	getMonthlyDataOverviewFromCache(
		personalAccountId: string,
		date: string
	): PersonalAccountMonthlyDataOverviewFragment | undefined {
		const { year, month } = DateServiceUtil.getDetailsInformationFromDate(date);

		// load personal account from cache
		const personalAccount = this.getPersonalAccountFromCachce(personalAccountId);

		// get monthly data from personal account
		const monthlyData = personalAccount.monthlyData.find((d) => d.year === year && d.month === month);

		return monthlyData;
	}

	/* ========= READING FROM API ========= */

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
				optimisticResponse: {
					__typename: 'Mutation',
					createPersonalAccount: {
						__typename: 'PersonalAccount',
						name,
						createdAt: new Date().toDateString(),
						id: 'account-1234',
						userId: 'user-1234',
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

	getDefaultTagsExpense(): Observable<PersonalAccountTag[]> {
		return this.getDefaultTags().pipe(map((tags) => tags.filter((t) => t.type === TagDataType.Expense)));
	}

	getDefaultTagsIncome(): Observable<PersonalAccountTag[]> {
		return this.getDefaultTags().pipe(map((tags) => tags.filter((t) => t.type === TagDataType.Income)));
	}

	getPersonalAccountMonthlyDataById(monthlyDataId: string): Observable<PersonalAccountMonthlyDataDetailFragment> {
		return this.getPersonalAccountMonthlyDataByIdGQL
			.watch({
				input: monthlyDataId,
			})
			.valueChanges.pipe(map((res) => res.data.getPersonalAccountMonthlyDataById));
	}

	createdMonthlyDataSubscription(): Observable<PersonalAccountMonthlyDataOverviewFragment | undefined> {
		return this.createdMonthlyDataSubscriptionGQL.subscribe().pipe(
			map((res) => res.data?.createdMonthlyData),
			tap((createdMonthlyData) => {
				if (!createdMonthlyData) {
					return;
				}
				console.log('subscription', createdMonthlyData);
				// save createdMonthlyData into PersonalAccount.monthlyData
				const personalAccount = this.getPersonalAccountFromCachce(createdMonthlyData.personalAccountId);

				// sort ASC
				const mergedMonthlyData = [...personalAccount.monthlyData, createdMonthlyData].sort((a, b) =>
					b.year > a.year ? -1 : b.year === a.year && b.month > a.month ? -1 : 1
				);

				// save to cache
				this.apollo.client.writeFragment<PersonalAccountOverviewFragment>({
					id: `PersonalAccount:${personalAccount.id}`,
					fragmentName: 'PersonalAccountOverview',
					fragment: PersonalAccountOverviewFragmentDoc,
					data: {
						...personalAccount,
						monthlyData: mergedMonthlyData,
					},
				});
			})
		);
	}

	createPersonalAccountDailyEntry(
		input: PersonalAccountDailyDataCreate
	): Observable<FetchResult<CreatePersonalAccountDailyEntryMutation>> {
		const { week } = DateServiceUtil.getDetailsInformationFromDate(input.date);
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
						monthlyDataId: monthlyData?.id || '',
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

	/**
	 * Persist daily data into monthly.dailyData array
	 * if monthly data not loaded, skip the operation, daily data will be loaded by getPersonalAccountMonthlyDataById
	 *
	 * @param dailyData
	 * @param operation
	 * @returns
	 */
	private updateMonthlyDailyData(dailyData: PersonalAccountDailyDataFragment, operation: 'add' | 'remove'): void {
		const monthlyDetails = this.getPersonalAccountMonthlyDataByIdFromCache(dailyData.monthlyDataId);

		// happens when creating a daily data to the future/past months - information received by subscriptions
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

	/**
	 *
	 * @param personalAccountId
	 * @param dailyData
	 * @param operation - increase add dailyData.value (create), 'decrease' removes the value (delete)
	 */
	private updateAggregations(
		personalAccountId: string,
		dailyData: PersonalAccountDailyDataFragment,
		operation: 'increase' | 'decrease'
	): void {
		const personalAccount = this.getPersonalAccountFromCachce(personalAccountId);
		const dateDetails = DateServiceUtil.getDetailsInformationFromDate(Number(dailyData.date));
		const multiplyer = operation === 'increase' ? 1 : -1; // add or remove data from aggregation

		// update yearlyAggregaton that match tagId
		// TODO: check if tag exists
		// TODO - removing item to update chart data - OK
		const yearlyAggregaton = personalAccount.yearlyAggregaton.map((data) => {
			if (data.tag.id === dailyData.tagId) {
				return { ...data, value: data.value + dailyData.value * multiplyer, entries: data.entries + 1 * multiplyer };
			}
			return data;
		});

		// if -1 means dailyData was created for not yet saved monthly data
		const weeklyAggregatonIndex = personalAccount.weeklyAggregaton.findIndex(
			(weeklyData) =>
				weeklyData.year === dateDetails.year &&
				weeklyData.month === dateDetails.month &&
				weeklyData.week === dateDetails.week
		);
		// if -f means there is not weekly aggregation for specific tag
		const weeklyAggregatonDataIndex = personalAccount.weeklyAggregaton[weeklyAggregatonIndex]?.data?.findIndex(
			(d) => d.tag.id === dailyData.tag.id
		);

		// only used when monthly data not exists
		const weeklyAggregationData: PersonalAccountWeeklyAggregationOutput = {
			__typename: 'PersonalAccountWeeklyAggregationOutput',
			id: `${dateDetails.year}-${dateDetails.month}-${dateDetails.week}`,
			year: dateDetails.year,
			month: dateDetails.month,
			week: dateDetails.week,
			data: [
				{
					__typename: 'PersonalAccountAggregationDataOutput',
					entries: 1,
					tag: dailyData.tag,
					value: dailyData.value,
				},
			],
		};

		// only used when no tag for specific week
		const aggregationDailyData: PersonalAccountAggregationDataOutput = {
			__typename: 'PersonalAccountAggregationDataOutput',
			entries: 1,
			tag: dailyData.tag,
			value: dailyData.value,
		};

		const weeklyAggregaton =
			weeklyAggregatonIndex === -1 // append weeklyAggregationData to other
				? [...personalAccount.weeklyAggregaton, weeklyAggregationData]
				: weeklyAggregatonDataIndex === -1 // new tag for existing week
				? personalAccount.weeklyAggregaton.map((d) =>
						d.id === weeklyAggregationData.id ? { ...d, data: [aggregationDailyData] } : { ...d }
				  )
				: // increase value for saved tag
				  personalAccount.weeklyAggregaton.map((d) =>
						d.id === weeklyAggregationData.id
							? {
									...d,
									data: d.data.map((dDaily) =>
										dDaily.tag.id === dailyData.tag.id
											? {
													...dDaily,
													entries: dDaily.entries + 1 * multiplyer,
													value: dDaily.value + dailyData.value * multiplyer,
											  }
											: { ...dDaily }
									),
							  }
							: { ...d }
				  );

		// update weeklyAggregaton that match tagId and month & week
		// will not update if weeklyAggregatonIndex === -1 or weeklyAggregatonDataIndex === -1
		// const weeklyAggregaton = personalAccount.weeklyAggregaton.map((weeklyData) => {
		// 	// find specific week that needs to be updated
		// 	if (weeklyData.year === dateDetails.year && weeklyData.month === dateDetails.month && weeklyData.week === dateDetails.week) {
		// 		// update data in array that match tagId
		// 		const weeklyAggregatonDailyData = weeklyData.data.map((d) => {
		// 			if (d.tag.id === dailyData.tagId) {
		// 				return { ...d, entries: d.entries + 1 * multiplyer, value: d.value + dailyData.value * multiplyer };
		// 			}

		// 			// not upadted daily data
		// 			return d;
		// 		});
		// 		// upadted weekly data
		// 		return { ...weeklyData, data: weeklyAggregatonDailyData };

		// 	}

		// 	// not updated weekly data
		// 	return weeklyData;
		// });

		// const weeklyAggregaton = [...personalAccount.weeklyAggregaton];

		// if (weeklyAggregatonIndex === -1) {
		// 	// dailyData for not yet saved weekly data
		// 	weeklyAggregaton.push({
		// 		__typename: 'PersonalAccountWeeklyAggregationOutput',
		// 		id: `${dateDetails.year}-${dateDetails.month}-${dateDetails.week}`,
		// 		year: dateDetails.year,
		// 		month: dateDetails.month,
		// 		week: dateDetails.week,
		// 		data: [
		// 			{
		// 				__typename: 'PersonalAccountAggregationDataOutput',
		// 				entries: 1,
		// 				tag: dailyData.tag,
		// 				value: dailyData.value,
		// 			},
		// 		],
		// 	});
		// 	// sort ASC
		// 	weeklyAggregaton.sort((a, b) => (a.id < b.id ? 1 : -1));
		// } else if (weeklyAggregatonDataIndex === -1) {
		// 	weeklyAggregaton[weeklyAggregatonIndex].data.push({
		// 		__typename: 'PersonalAccountAggregationDataOutput',
		// 		entries: 1,
		// 		tag: dailyData.tag,
		// 		value: dailyData.value,
		// 	});
		// } else {
		// 	weeklyAggregaton[weeklyAggregatonIndex].data[weeklyAggregatonDataIndex].entries += 1 * multiplyer;
		// 	weeklyAggregaton[weeklyAggregatonIndex].data[weeklyAggregatonDataIndex].value += dailyData.value * multiplyer;
		// }

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
			fragment: PersonalAccountOverviewFragmentDoc,
			data: {
				...personalAccount,
				yearlyAggregaton,
				weeklyAggregaton,
				monthlyData,
			},
		});
	}
}

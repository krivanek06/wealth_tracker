import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import {
	CreatePersonalAccountDailyEntryGQL,
	CreatePersonalAccountTagGQL,
	DeletePersonalAccountDailyEntryGQL,
	DeletePersonalAccountTagGQL,
	EditPersonalAccountDailyEntryGQL,
	EditPersonalAccountTagGQL,
	GetPersonalAccountAvailableTagImagesGQL,
	GetPersonalAccountByUserGQL,
	GetPersonalAccountDailyDataGQL,
	PersonalAccountDailyDataCreate,
	PersonalAccountDailyDataDelete,
	PersonalAccountDailyDataEdit,
	PersonalAccountDailyDataEditOutput,
	PersonalAccountDailyDataOutputFragment,
	PersonalAccountDailyDataQuery,
	PersonalAccountDetailsFragment,
	PersonalAccountTagDataCreate,
	PersonalAccountTagDataEdit,
	PersonalAccountTagFragment,
} from '../../graphql';
import { PersonalAccountCacheService } from './personal-account-cache.service';

@Injectable({
	providedIn: 'root',
})
export class PersonalAccountApiService {
	constructor(
		private getPersonalAccountByUserGQL: GetPersonalAccountByUserGQL,
		private createPersonalAccountDailyEntryGQL: CreatePersonalAccountDailyEntryGQL,
		private editPersonalAccountDailyEntryGQL: EditPersonalAccountDailyEntryGQL,
		private deletePersonalAccountDailyEntryGQL: DeletePersonalAccountDailyEntryGQL,
		private getPersonalAccountDailyDataGQL: GetPersonalAccountDailyDataGQL,
		private getPersonalAccountAvailableTagImagesGQL: GetPersonalAccountAvailableTagImagesGQL,
		private createPersonalAccountTagGQL: CreatePersonalAccountTagGQL,
		private editPersonalAccountTagGQL: EditPersonalAccountTagGQL,
		private deletePersonalAccountTagGQL: DeletePersonalAccountTagGQL,
		private personalAccountCacheService: PersonalAccountCacheService
	) {}

	getPersonalAccountDetails(): Observable<PersonalAccountDetailsFragment | null> {
		return this.getPersonalAccountByUserGQL
			.watch()
			.valueChanges.pipe(map((res) => res.data?.getPersonalAccountByUser ?? null));
	}

	// createPersonalAccount(): Observable<PersonalAccountOverviewFragment | null> {
	// 	return this.createPersonalAccountGQL.mutate().pipe(map((res) => res.data?.createPersonalAccount ?? null));
	// }

	// editPersonalAccount(input: PersonalAccountEditInput): Observable<FetchResult<EditPersonalAccountMutation>> {
	// 	return this.editPersonalAccountGQL.mutate({
	// 		input,
	// 	});
	// }

	// deletePersonalAccount(): Observable<PersonalAccountOverviewFragment | undefined> {
	// 	return this.deletePersonalAccountGQL.mutate().pipe(map((res) => res.data?.deletePersonalAccount));
	// }

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
			.valueChanges.pipe(map((res) => res.data?.getPersonalAccountDailyData ?? []));
	}

	getPersonalAccountAvailableTagImages(): Observable<string[]> {
		return this.getPersonalAccountAvailableTagImagesGQL
			.watch()
			.valueChanges.pipe(map((res) => res.data.getAllAvailableTagImages));
	}

	createPersonalAccountTag(input: PersonalAccountTagDataCreate): Observable<PersonalAccountTagFragment | null> {
		return this.createPersonalAccountTagGQL
			.mutate({
				input,
			})
			.pipe(
				map((res) => res.data?.createPersonalAccountTag ?? null),
				catchError(() => of(null))
			);
	}

	editPersonalAccountTag(input: PersonalAccountTagDataEdit): Observable<PersonalAccountTagFragment | null> {
		return this.editPersonalAccountTagGQL
			.mutate({
				input,
			})
			.pipe(
				map((res) => res.data?.editPersonalAccountTag ?? null),
				catchError(() => of(null))
			);
	}

	deletePersonalAccountTag(removingTag: PersonalAccountTagFragment): Observable<PersonalAccountTagFragment | null> {
		return this.deletePersonalAccountTagGQL
			.mutate(
				{
					input: {
						id: removingTag.id,
					},
				},
				{
					optimisticResponse: {
						__typename: 'Mutation',
						deletePersonalAccountTag: {
							__typename: 'PersonalAccountTag',
							id: removingTag.id,
							color: removingTag.color,
							imageUrl: removingTag.imageUrl,
							createdAt: removingTag.createdAt,
							name: removingTag.name,
							type: removingTag.type,
							budgetMonthly: removingTag.budgetMonthly,
						},
					},
					update: (cache, { data }) => {
						const result = data?.deletePersonalAccountTag;
						console.log('cache', result);
						if (!result) {
							return;
						}

						const personalAccount = this.personalAccountCacheService.getPersonalAccountDetails();

						// remove tag from array in personal account
						this.personalAccountCacheService.updatePersonalAccountDetails({
							...personalAccount,
							personalAccountTag: personalAccount.personalAccountTag.filter((d) => d.id !== result.id),
							yearlyAggregation: personalAccount.yearlyAggregation.filter((d) => d.tag.id !== result.id),
							weeklyAggregation: personalAccount.weeklyAggregation.map((weeklyData) => {
								return { ...weeklyData, data: weeklyData.data.filter((d) => d.tag.id !== result.id) };
							}),
						});

						// remove tag from cache
						this.personalAccountCacheService.removePersonalAccountTagFromCache(result.id);

						// refetch daily data
						this.personalAccountCacheService.refetchDailyDataQuery();
					},
				}
			)
			.pipe(
				map((res) => res.data?.deletePersonalAccountTag ?? null),
				catchError(() => of(null))
			);
	}
}

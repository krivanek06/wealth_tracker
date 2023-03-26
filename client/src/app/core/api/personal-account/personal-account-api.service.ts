import { Injectable } from '@angular/core';
import { FetchResult } from '@apollo/client/core';
import { catchError, map, Observable, of } from 'rxjs';
import {
	CreatePersonalAccountDailyEntryGQL,
	CreatePersonalAccountGQL,
	DeletePersonalAccountDailyEntryGQL,
	DeletePersonalAccountGQL,
	EditPersonalAccountDailyEntryGQL,
	EditPersonalAccountGQL,
	EditPersonalAccountMutation,
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
	PersonalAccountEditInput,
	PersonalAccountOverviewFragment,
} from '../../graphql';
import {
	CreatePersonalAccountTagGQL,
	DeletePersonalAccountTagGQL,
	EditPersonalAccountTagGQL,
	PersonalAccountTagDataCreate,
	PersonalAccountTagDataDelete,
	PersonalAccountTagDataEdit,
	PersonalAccountTagFragment,
} from './../../graphql/schema-backend.service';

@Injectable({
	providedIn: 'root',
})
export class PersonalAccountApiService {
	constructor(
		private getPersonalAccountByUserGQL: GetPersonalAccountByUserGQL,
		private createPersonalAccountGQL: CreatePersonalAccountGQL,
		private editPersonalAccountGQL: EditPersonalAccountGQL,
		private deletePersonalAccountGQL: DeletePersonalAccountGQL,
		private createPersonalAccountDailyEntryGQL: CreatePersonalAccountDailyEntryGQL,
		private editPersonalAccountDailyEntryGQL: EditPersonalAccountDailyEntryGQL,
		private deletePersonalAccountDailyEntryGQL: DeletePersonalAccountDailyEntryGQL,
		private getPersonalAccountDailyDataGQL: GetPersonalAccountDailyDataGQL,
		private getPersonalAccountAvailableTagImagesGQL: GetPersonalAccountAvailableTagImagesGQL,
		private createPersonalAccountTagGQL: CreatePersonalAccountTagGQL,
		private editPersonalAccountTagGQL: EditPersonalAccountTagGQL,
		private deletePersonalAccountTagGQL: DeletePersonalAccountTagGQL
	) {}

	// TODO: does this work if I have no account and I create one ???
	getPersonalAccountDetails(): Observable<PersonalAccountDetailsFragment | null> {
		return this.getPersonalAccountByUserGQL
			.watch()
			.valueChanges.pipe(map((res) => res.data.getPersonalAccountByUser ?? null));
	}

	createPersonalAccount(): Observable<PersonalAccountOverviewFragment | undefined> {
		return this.createPersonalAccountGQL.mutate().pipe(map((res) => res.data?.createPersonalAccount));
	}

	editPersonalAccount(input: PersonalAccountEditInput): Observable<FetchResult<EditPersonalAccountMutation>> {
		return this.editPersonalAccountGQL.mutate({
			input,
		});
	}

	deletePersonalAccount(): Observable<PersonalAccountOverviewFragment | undefined> {
		return this.deletePersonalAccountGQL.mutate().pipe(map((res) => res.data?.deletePersonalAccount));
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

	deletePersonalAccountTag(input: PersonalAccountTagDataDelete): Observable<PersonalAccountTagFragment | null> {
		return this.deletePersonalAccountTagGQL
			.mutate({
				input,
			})
			.pipe(
				map((res) => res.data?.deletePersonalAccountTag ?? null),
				catchError(() => of(null))
			);
	}
}

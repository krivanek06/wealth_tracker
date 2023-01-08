import { Injectable } from '@angular/core';
import { FetchResult } from '@apollo/client/core';
import { map, Observable } from 'rxjs';
import {
	CreatePersonalAccountDailyEntryGQL,
	CreatePersonalAccountGQL,
	DeletePersonalAccountDailyEntryGQL,
	DeletePersonalAccountGQL,
	EditPersonalAccountDailyEntryGQL,
	EditPersonalAccountGQL,
	EditPersonalAccountMutation,
	GetPersonalAccountByIdGQL,
	GetPersonalAccountDailyDataGQL,
	GetPersonalAccountsGQL,
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
		private getPersonalAccountDailyDataGQL: GetPersonalAccountDailyDataGQL
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

	createPersonalAccount(name: string): Observable<PersonalAccountOverviewFragment | undefined> {
		return this.createPersonalAccountGQL
			.mutate({
				name,
			})
			.pipe(map((res) => res.data?.createPersonalAccount));
	}

	editPersonalAccount(input: PersonalAccountEditInput): Observable<FetchResult<EditPersonalAccountMutation>> {
		return this.editPersonalAccountGQL.mutate({
			input,
		});
	}

	deletePersonalAccount(accountId: string): Observable<PersonalAccountOverviewFragment | undefined> {
		return this.deletePersonalAccountGQL
			.mutate({
				accountId,
			})
			.pipe(map((res) => res.data?.deletePersonalAccount));
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

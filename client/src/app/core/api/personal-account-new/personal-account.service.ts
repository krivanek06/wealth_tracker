import { Injectable, inject } from '@angular/core';
import { DocumentData, DocumentReference, Firestore, arrayUnion, doc, setDoc } from '@angular/fire/firestore';
import { docData as rxDocData } from 'rxfire/firestore';
import { BehaviorSubject, Observable, map, of, tap } from 'rxjs';
import { AuthenticationAccountService } from '../../services';
import { assignTypesClient } from '../../utils';
import {
	PERSONAL_ACCOUNT_DEFAULT_TAGS,
	PersonalAccountTag,
	personalAccountTagImageName,
} from './personal-account-tags.model';
import { PersonalAccountNew } from './personal-account-types.model';

@Injectable({
	providedIn: 'root',
})
export class PersonalAccountService {
	private firestore = inject(Firestore);
	private authenticationAccountService = inject(AuthenticationAccountService);

	private personalAccount$ = new BehaviorSubject<PersonalAccountNew | undefined>(undefined);

	constructor() {
		this.loadUserPersonalAccount();
	}

	get personalAccount(): PersonalAccountNew {
		const value = this.personalAccount$.getValue();
		if (!value) {
			throw new Error('Personal account is not loaded yet');
		}
		return value;
	}

	getUserPersonalAccount(): Observable<PersonalAccountNew | undefined> {
		return this.personalAccount$.asObservable();
	}

	getPersonalAccountAvailableTagImages() {
		return personalAccountTagImageName;
	}

	getPersonalAccountTags(): Observable<PersonalAccountTag[]> {
		return this.getUserPersonalAccount().pipe(map((res) => res?.tags ?? []));
	}

	getPersonalAccountTagsExpense() {
		return this.getPersonalAccountTags().pipe(map((tags) => tags.filter((tag) => tag.type === 'EXPENSE')));
	}

	getPersonalTagsIncome() {
		return this.getPersonalAccountTags().pipe(map((tags) => tags.filter((tag) => tag.type === 'INCOME')));
	}

	createPersonalAccountTag(tag: PersonalAccountTag): void {
		// no auth user
		if (!this.authenticationAccountService.currentUser) {
			return;
		}

		// limit user
		if (this.personalAccount.tags.length > 50) {
			throw new Error('You can have only 50 tags');
		}

		setDoc(
			this.getPersonalAccountDocRef(),
			{
				tags: arrayUnion(tag),
			},
			{ merge: true }
		);
	}

	editPersonalAccountTag(input: PersonalAccountTag): void {
		const newData = this.personalAccount.tags.map((tag) => {
			if (tag.name === input.name) {
				return input;
			}
			return tag;
		});

		setDoc(
			this.getPersonalAccountDocRef(),
			{
				tags: newData,
			},
			{ merge: true }
		);
	}

	deletePersonalAccountTag(input: PersonalAccountTag): void {
		const newData = this.personalAccount.tags.filter((tag) => tag.name !== input.name);

		setDoc(
			this.getPersonalAccountDocRef(),
			{
				tags: newData,
			},
			{ merge: true }
		);
	}

	private loadUserPersonalAccount(): void {
		// no auth user
		if (!this.authenticationAccountService.currentUser) {
			this.personalAccount$.next(undefined);
			return;
		}

		// first time user
		if (this.authenticationAccountService.isUserNew) {
			this.createEmptyPersonalAccount(this.authenticationAccountService.currentUser.uid);
		}

		// load data
		this.getPersonalAccountById(this.authenticationAccountService.currentUser.uid).pipe(
			tap((res) => this.personalAccount$.next(res))
		);
	}

	private getPersonalAccountById(userId?: string): Observable<PersonalAccountNew | undefined> {
		if (!userId) {
			return of(undefined);
		}
		return rxDocData(this.getPersonalAccountDocRef(), { idField: 'userId' });
	}

	private createEmptyPersonalAccount(userId: string): void {
		setDoc(
			this.getPersonalAccountDocRef(),
			{
				userId: userId,
				tags: [...PERSONAL_ACCOUNT_DEFAULT_TAGS],
			},
			{ merge: true }
		);
	}

	private getPersonalAccountDocRef(): DocumentReference<PersonalAccountNew, DocumentData> {
		return doc(this.firestore, `personal-accounts/${this.authenticationAccountService.currentUser?.uid}`).withConverter(
			assignTypesClient<PersonalAccountNew>()
		);
	}
}

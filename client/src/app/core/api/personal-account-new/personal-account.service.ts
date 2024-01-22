import { Injectable, inject } from '@angular/core';
import { Firestore, arrayUnion, collection, doc, setDoc } from '@angular/fire/firestore';
import { collection as rxCollection, docData as rxDocData } from 'rxfire/firestore';
import { BehaviorSubject, Observable, map, of, switchMap, tap } from 'rxjs';
import { v4 as uuid } from 'uuid';
import { AuthenticationAccountService } from '../../services';
import { DateServiceUtil, assignTypesClient } from '../../utils';
import { PersonalAccountAggregatorService } from './personal-account-aggregator.service';
import {
	PERSONAL_ACCOUNT_DEFAULT_TAGS,
	PERSONAL_ACCOUNT_DEFAULT_TAG_DATA,
	PersonalAccountTag,
	PersonalAccountTagCreate,
	personalAccountTagImageName,
} from './personal-account-tags.model';
import {
	PersonalAccountAggregationDataOutput,
	PersonalAccountDailyDataCreateNew,
	PersonalAccountDailyDataNew,
	PersonalAccountMonthlyDataNew,
	PersonalAccountMonthlyDataNewBasic,
	PersonalAccountNew,
	PersonalAccountWeeklyAggregationOutput,
} from './personal-account-types.model';

@Injectable({
	providedIn: 'root',
})
export class PersonalAccountService {
	private firestore = inject(Firestore);
	private authenticationAccountService = inject(AuthenticationAccountService);
	private personalAccountAggregatorService = inject(PersonalAccountAggregatorService);

	private personalAccount$ = new BehaviorSubject<PersonalAccountNew | undefined>(undefined);
	private personalAccountMonthlyData$ = new BehaviorSubject<PersonalAccountMonthlyDataNew[]>([]);

	constructor() {
		this.loadUserPersonalAccount();
		this.loadUserPersonalAccountMonthlyData();
	}

	get personalAccount(): PersonalAccountNew {
		const value = this.personalAccount$.getValue();
		if (!value) {
			throw new Error('Personal account is not loaded yet');
		}
		return value;
	}

	getYearlyAggregatedData(): Observable<PersonalAccountAggregationDataOutput[]> {
		return this.personalAccountMonthlyData$.pipe(
			map((data) => this.personalAccountAggregatorService.getAllYearlyAggregatedData(this.personalAccount, data))
		);
	}

	getWeeklyAggregatedData(): Observable<PersonalAccountWeeklyAggregationOutput[]> {
		return this.personalAccountMonthlyData$.pipe(
			map((data) => this.personalAccountAggregatorService.getAllWeeklyAggregatedData(this.personalAccount, data))
		);
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

	createPersonalAccountTag(tag: PersonalAccountTagCreate): Promise<void> {
		// no auth user
		if (!this.authenticationAccountService.currentUser) {
			return Promise.reject('No auth user');
		}

		// limit user
		if (this.personalAccount.tags.length > 50) {
			throw new Error('You can have only 50 tags');
		}

		const data: PersonalAccountTag = {
			...tag,
			id: uuid(),
		};

		return setDoc(
			this.getPersonalAccountDocRef(),
			{
				tags: arrayUnion(data),
			},
			{ merge: true }
		);
	}

	editPersonalAccountTag(input: PersonalAccountTag): Promise<void> {
		const newData = this.personalAccount.tags.map((tag) => {
			if (tag.name === input.name) {
				return input;
			}
			return tag;
		});

		return setDoc(
			this.getPersonalAccountDocRef(),
			{
				tags: newData,
			},
			{ merge: true }
		);
	}

	deletePersonalAccountTag(input: PersonalAccountTag): Promise<void> {
		const newData = this.personalAccount.tags.filter((tag) => tag.name !== input.name);

		return setDoc(
			this.getPersonalAccountDocRef(),
			{
				tags: newData,
			},
			{ merge: true }
		);
	}

	createPersonalAccountDailyEntry(input: PersonalAccountDailyDataCreateNew): Promise<void> {
		const { year, month, week } = DateServiceUtil.getDetailsInformationFromDate(input.date);

		const data: PersonalAccountDailyDataNew = {
			...input,
			id: uuid(),
			week,
		};

		// check if monthly data exists
		const monthlyData = this.personalAccountMonthlyData$
			.getValue()
			.find((data) => data.month === month && data.year === year);

		// if not create new
		if (!monthlyData) {
			return setDoc(this.getPersonalAccountMonthlyDocRef(month, year), {
				id: `${year}-${month}`,
				month,
				year,
				dailyData: [data],
			});
		}

		// update docs
		return setDoc(
			this.getPersonalAccountMonthlyDocRef(month, year),
			{
				dailyData: arrayUnion(data),
			},
			{ merge: true }
		);
	}

	deletePersonalAccountDailyEntry(input: PersonalAccountDailyDataNew): Promise<void> {
		const oldDataDates = DateServiceUtil.getDetailsInformationFromDate(input.date);

		// remove old data
		const oldMonthlyData = this.personalAccountMonthlyData$
			.getValue()
			.find((data) => data.month === oldDataDates.month && data.year === oldDataDates.year);

		// remove if exists
		if (!oldMonthlyData) {
			console.log('[deletePersonalAccountDailyEntry]: no old monthly data found', input);
			return Promise.resolve();
		}

		// filter out
		const newData = oldMonthlyData.dailyData.filter((data) => data.id !== input.id);

		// update
		return setDoc(
			this.getPersonalAccountMonthlyDocRef(oldDataDates.month, oldDataDates.year),
			{
				dailyData: newData,
			},
			{ merge: true }
		);
	}

	async editPersonalAccountDailyEntry(
		oldData: PersonalAccountDailyDataNew,
		newData: PersonalAccountDailyDataCreateNew
	): Promise<void> {
		// remove old
		await this.deletePersonalAccountDailyEntry(oldData);

		// add new
		await this.createPersonalAccountDailyEntry(newData);
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
		rxDocData(this.getPersonalAccountDocRef(), { idField: 'userId' })
			.pipe(tap((res) => this.personalAccount$.next(res)))
			.subscribe((x) => console.log('loadUserPersonalAccount', x));
	}

	private loadUserPersonalAccountMonthlyData(): void {
		this.personalAccount$
			.asObservable()
			.pipe(
				switchMap((account) => (!account ? of([]) : rxCollection(this.getPersonalAccountMonthlyCollectionRef()))),
				map((res) => res.map((doc) => doc.data())),
				map((data) =>
					data.map(
						(d) =>
							({
								...d,
								dailyData: d.dailyData.map((dd) => ({
									...dd,
									tag: this.personalAccount.tags.find((t) => t.id === dd.tagId) ?? PERSONAL_ACCOUNT_DEFAULT_TAG_DATA,
									month: d.month,
									year: d.year,
								})),
							}) satisfies PersonalAccountMonthlyDataNew
					)
				),
				tap((data) => this.personalAccountMonthlyData$.next(data))
			)
			.subscribe((x) => console.log('loadUserPersonalAccountMonthlyData', x));
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

	private getPersonalAccountMonthlyDocRef(month: number, year: number) {
		return doc(this.getPersonalAccountMonthlyCollectionRef(), `${year}-${month}`);
	}

	private getPersonalAccountMonthlyCollectionRef() {
		return collection(this.getPersonalAccountDocRef(), `monthly-data`).withConverter(
			assignTypesClient<PersonalAccountMonthlyDataNewBasic>()
		);
	}

	private getPersonalAccountDocRef() {
		return doc(this.firestore, `personal-accounts/${this.authenticationAccountService.currentUser?.uid}`).withConverter(
			assignTypesClient<PersonalAccountNew>()
		);
	}
}

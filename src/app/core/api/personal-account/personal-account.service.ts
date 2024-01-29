import { Injectable, computed, effect, inject } from '@angular/core';
import { Firestore, arrayUnion, collection, deleteDoc, doc, setDoc } from '@angular/fire/firestore';
import { computedAsync } from 'ngxtension/computed-async';
import { collection as rxCollection, docData as rxDocData } from 'rxfire/firestore';
import { catchError, map, of } from 'rxjs';
import { v4 as uuid } from 'uuid';
import { AuthenticationAccountService } from '../../services';
import { assignTypesClient, getCurrentDateDefaultFormat, getDetailsInformationFromDate } from '../../utils';
import { PersonalAccountAggregatorService } from './personal-account-aggregator.service';
import {
  PERSONAL_ACCOUNT_DEFAULT_TAGS,
  PERSONAL_ACCOUNT_DEFAULT_TAG_DATA,
  PersonalAccountTag,
  PersonalAccountTagCreate,
  personalAccountTagImageName,
} from './personal-account-tags.model';
import {
  PersonalAccountDailyData,
  PersonalAccountDailyDataBasic,
  PersonalAccountDailyDataCreate,
  PersonalAccountMonthlyDataNew,
  PersonalAccountMonthlyDataNewBasic,
  PersonalAccountNew,
} from './personal-account-types.model';

@Injectable({
	providedIn: 'root',
})
export class PersonalAccountService {
	private firestore = inject(Firestore);
	private authenticationAccountService = inject(AuthenticationAccountService);
	private personalAccountAggregatorService = inject(PersonalAccountAggregatorService);

	personalAccountSignal = computedAsync(() => {
		const user = this.authenticationAccountService.getCurrentUser();
		return !user ? of(undefined) : rxDocData(this.getPersonalAccountDocRef(user.uid), { idField: 'userId' });
	});

	personalAccountMonthlyDataSignal = computedAsync(
		() => {
			const user = this.authenticationAccountService.getCurrentUser();
			const tags = this.personalAccountTagsSignal();

			return !user
				? []
				: rxCollection(this.getPersonalAccountMonthlyCollectionRef(user.uid)).pipe(
						map((res) => res.map((doc) => doc.data())),
						map((data) =>
							data.map(
								(d) =>
									({
										...d,
										dailyData: d.dailyData
											// sort daily data by date
											.sort((a, b) => (b.date < a.date ? 1 : -1))
											// map daily data to include tag information
											.map((dd) => ({
												...dd,
												tag: tags.find((t) => t.id === dd.tagId) ?? PERSONAL_ACCOUNT_DEFAULT_TAG_DATA,
											})),
									}) satisfies PersonalAccountMonthlyDataNew
							)
						),
						catchError(() => of([]))
					);
		},
		{ initialValue: [] }
	);

	yearlyAggregatedSignal = computed(() => {
		const data = this.personalAccountMonthlyDataSignal();
		const availableTags = this.personalAccountTagsSignal();
		return this.personalAccountAggregatorService.getAllYearlyAggregatedData(availableTags, data);
	});
	weeklyAggregatedSignal = computed(() => {
		const data = this.personalAccountMonthlyDataSignal();
		const availableTags = this.personalAccountTagsSignal();
		return this.personalAccountAggregatorService.getAllWeeklyAggregatedData(availableTags, data);
	});

	personalAccountTagsSignal = computed(() => this.personalAccountSignal()?.tags ?? []);
	personalAccountTagsExpenseSignal = computed(() =>
		this.personalAccountTagsSignal().filter((tag) => tag.type === 'EXPENSE')
	);
	personalAccountTagsIncomeSignal = computed(() =>
		this.personalAccountTagsSignal().filter((tag) => tag.type === 'INCOME')
	);

	constructor() {
		effect(() => {
			const isUserNew = this.authenticationAccountService.isUserNew();
			const user = this.authenticationAccountService.getCurrentUser();
			console.log('effect is running', isUserNew, user);
			if (isUserNew && user) {
				console.log('User is new, creating empty portfolio account');
				this.createEmptyPersonalAccount(user.uid);
			}
		});
	}

	getPersonalAccountAvailableTagImages() {
		return personalAccountTagImageName;
	}

	createPersonalAccountTag(tag: PersonalAccountTagCreate): Promise<void> {
		const currentUser = this.authenticationAccountService.getCurrentUserMust();

		// limit user
		if (this.personalAccountTagsSignal().length > 50) {
			throw new Error('You can have only 50 tags');
		}

		const data: PersonalAccountTag = {
			...tag,
			id: uuid(),
		};

		return setDoc(
			this.getPersonalAccountDocRef(currentUser.uid),
			{
				tags: arrayUnion(data),
			},
			{ merge: true }
		);
	}

	editPersonalAccountTag(input: PersonalAccountTag): Promise<void> {
		const currentUser = this.authenticationAccountService.getCurrentUserMust();
		const newData = this.personalAccountTagsSignal().map((tag) => (tag.id === input.id ? input : tag));

		return setDoc(
			this.getPersonalAccountDocRef(currentUser.uid),
			{
				tags: newData,
			},
			{ merge: true }
		);
	}

	deletePersonalAccountTag(input: PersonalAccountTag): Promise<void> {
		const currentUser = this.authenticationAccountService.getCurrentUserMust();
		const newData = this.personalAccountTagsSignal().filter((tag) => tag.id !== input.id);

		return setDoc(
			this.getPersonalAccountDocRef(currentUser.uid),
			{
				tags: newData,
			},
			{ merge: true }
		);
	}

	createPersonalAccountDailyEntry(input: PersonalAccountDailyDataCreate): Promise<void> {
		const currentUser = this.authenticationAccountService.getCurrentUserMust();

		// create DB key from provided date
		const dateKey = getCurrentDateDefaultFormat({
			onlyMonth: true,
			someDate: input.date,
		});

		const data: PersonalAccountDailyDataBasic = {
			id: uuid(),
			date: input.date,
			value: input.value,
			tagId: input.tagId,
		};

		// check if monthly data exists
		const monthlyData = this.personalAccountMonthlyDataSignal().find((data) => data.id === dateKey);

		// if not create new
		if (!monthlyData) {
			return setDoc(this.getPersonalAccountMonthlyDocRef(currentUser.uid, dateKey), {
				id: dateKey,
				dailyData: [data],
			});
		}

		// update docs
		return setDoc(
			this.getPersonalAccountMonthlyDocRef(currentUser.uid, dateKey),
			{
				dailyData: arrayUnion(data),
			},
			{ merge: true }
		);
	}

	deletePersonalAccountDailyEntry(input: PersonalAccountDailyData): Promise<void> {
		const currentUser = this.authenticationAccountService.getCurrentUserMust();
		const { currentDateMonthCorrect } = getDetailsInformationFromDate(input.date);

		// remove old data
		const oldMonthlyData = this.personalAccountMonthlyDataSignal().find((data) => data.id === currentDateMonthCorrect);

		// remove if exists
		if (!oldMonthlyData) {
			console.log('[deletePersonalAccountDailyEntry]: no old monthly data found', input);
			return Promise.resolve();
		}

		// filter out
		const newData = oldMonthlyData.dailyData.filter((data) => data.id !== input.id);

		// update
		return setDoc(
			this.getPersonalAccountMonthlyDocRef(currentUser.uid, oldMonthlyData.id),
			{
				dailyData: newData,
			},
			{ merge: true }
		);
	}

	deleteMonthlyData(monthlyData: PersonalAccountMonthlyDataNew): Promise<void> {
		const currentUser = this.authenticationAccountService.getCurrentUserMust();

		return deleteDoc(this.getPersonalAccountMonthlyDocRef(currentUser.uid, monthlyData.id));
	}

	async editPersonalAccountDailyEntry(
		oldData: PersonalAccountDailyData,
		newData: PersonalAccountDailyDataCreate
	): Promise<void> {
		// remove old
		await this.deletePersonalAccountDailyEntry(oldData);

		// add new
		await this.createPersonalAccountDailyEntry(newData);
	}

	private createEmptyPersonalAccount(userId: string): void {
		setDoc(
			this.getPersonalAccountDocRef(userId),
			{
				userId: userId,
				tags: [...PERSONAL_ACCOUNT_DEFAULT_TAGS],
			},
			{ merge: true }
		);
	}

	private getPersonalAccountMonthlyDocRef(userId: string, dateKey: string) {
		return doc(this.getPersonalAccountMonthlyCollectionRef(userId), dateKey);
	}

	private getPersonalAccountMonthlyCollectionRef(userId: string) {
		return collection(this.getPersonalAccountDocRef(userId), `monthly-data`).withConverter(
			assignTypesClient<PersonalAccountMonthlyDataNewBasic>()
		);
	}

	private getPersonalAccountDocRef(userId: string) {
		return doc(this.firestore, `personal-accounts/${userId}`).withConverter(assignTypesClient<PersonalAccountNew>());
	}
}

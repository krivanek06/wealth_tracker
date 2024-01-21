import { PersonalAccountTag, PersonalAccountTagImageName } from './personal-account-tags.model';

export type PersonalAccountNew = {
	userId: string;
	tags: PersonalAccountTag[];
};

export type PersonalAccountMonthlyDataNew = {
	id: string;
	month: number;
	year: number;
	dailyData: PersonalAccountDailyDataNew[];
};

export type PersonalAccountDailyDataNew = {
	id: string;
	tagId: PersonalAccountTagImageName;
	value: number;
	date: string; // i.e: YYYY-MM-DDTHH:mm:ss
	week: number;
};

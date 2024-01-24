import { PersonalAccountTag } from './personal-account-tags.model';

export type PersonalAccountNew = {
	userId: string;
	tags: PersonalAccountTag[];
};

export type PersonalAccountMonthlyDataNewBasic = {
	id: string;
	month: number;
	year: number;
	dailyData: PersonalAccountDailyDataBasic[];
};

export type PersonalAccountDailyDataBasic = {
	id: string;
	tagId: string;
	value: number;
	date: string; // i.e: YYYY-MM-DD
	week: number;
};

export type PersonalAccountMonthlyDataNew = PersonalAccountMonthlyDataNewBasic & {
	dailyData: PersonalAccountDailyDataNew[];
};

export type PersonalAccountDailyDataNew = PersonalAccountDailyDataBasic & {
	month: number;
	year: number;
	tag: PersonalAccountTag;
};

export type PersonalAccountDailyDataCreateNew = Omit<PersonalAccountDailyDataBasic, 'id' | 'week' | 'year' | 'month'>;

export type PersonalAccountAggregationDataOutput = {
	value: number;
	entries: number;
	tag: PersonalAccountTag;
};

export type PersonalAccountWeeklyAggregationOutput = {
	id: string;
	year: number;
	month: number;
	week: number;
	data: PersonalAccountAggregationDataOutput[];
};

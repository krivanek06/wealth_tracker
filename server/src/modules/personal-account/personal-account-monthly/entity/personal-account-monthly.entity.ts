import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import {
	PersonalAccountDailyData as PersonalAccountDailyDataClient,
	PersonalAccountMonthlyData as PersonalAccountMonthlyDataClient,
} from '@prisma/client';

@ObjectType()
export class PersonalAccountDailyData implements PersonalAccountDailyDataClient {
	@Field(() => String, {
		description: 'Random ID to identify the entity',
	})
	id: string;

	@Field(() => Float, {
		description: 'Money amount change for a tagId',
	})
	value: number;

	@Field(() => String)
	date: Date;

	@Field(() => String, {
		description: 'Reference to User.id, person who has created the entry',
	})
	userId: string;

	@Field(() => String, {
		description: 'Reference to PersonalAccountTag.id',
	})
	tagId: string;

	@Field(() => Int, {
		description: 'To which week in a year is this account change associated. Like 37 for "Week 37"',
	})
	week: number;
}

@ObjectType()
export class PersonalAccountMonthlyData implements PersonalAccountMonthlyDataClient {
	@Field(() => String)
	id: string;

	@Field(() => Int, {
		description: 'To which month in a year is this account change associated. Like 8 for September',
	})
	month: number;

	@Field(() => Int, {
		description: 'To which year is this account change associated.',
	})
	year: number;

	@Field(() => PersonalAccountDailyData, {
		description: 'List of daily expenses user has made during this month period',
	})
	dailyData: PersonalAccountDailyData[];

	@Field(() => String, {
		description: 'Reference to PersonalAccount.id',
	})
	personalAccountId: string;
}

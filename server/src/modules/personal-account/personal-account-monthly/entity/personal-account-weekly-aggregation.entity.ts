import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { PersonalAccountDailyData } from './personal-account-monthly.entity';

@ObjectType()
export class PersonalAccountWeeklyAggregation {
	@Field(() => String, {
		description: 'Randomly generated ID, not associated with DB entry',
	})
	id: string;

	@Field(() => Int, {
		description: 'To which month in a year is this account change associated',
	})
	year: number;

	@Field(() => Int, {
		description: 'To which month in a year is this account change associated. Like 8 for September',
	})
	month: number;

	@Field(() => Int, {
		description: 'To which week in a year is this account change associated. Like 37 for "Week 37"',
	})
	week: number;

	@Field(() => Float, {
		description: 'Sum of values for a specific personalAccountTagId',
	})
	value: number;

	@Field(() => Int, {
		description: 'How many entries per personalAccountTagId per week there were',
	})
	entries: number;

	// @Field(() => String, {
	// 	description: 'Reference to PersonalAccountMonthlyData.id',
	// })
	// personalAccountMonthlyDataId: string;

	@Field(() => String, {
		description: 'Reference to PersonalAccount.id',
	})
	personalAccountTagId: string;
}

export type PersonalAccountDailyDataExtended = PersonalAccountDailyData & { year: number; month: number };

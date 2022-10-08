import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { PersonalAccountWeeklyAggregation as PersonalAccountWeeklyAggregationClient } from '@prisma/client';

@ObjectType()
export class PersonalAccountWeeklyAggregation implements PersonalAccountWeeklyAggregationClient {
	@Field(() => String)
	id: string;

	@Field(() => Int, {
		description: 'To which month in a year is this account change associated. Like 8 for September',
	})
	year: number;

	@Field(() => Int, {
		description: 'To which week in a year is this account change associated. Like 37 for "Week 37"',
	})
	week: number;

	@Field(() => Float, {
		description: 'Sum of values for a specific personalAccountTagId',
	})
	value: number;

	@Field(() => String, {
		description: 'Reference to PersonalAccountMonthlyData.id',
	})
	personalAccountMonthlyDataId: string;

	@Field(() => String, {
		description: 'Reference to PersonalAccount.id',
	})
	personalAccountTagId: string;
}

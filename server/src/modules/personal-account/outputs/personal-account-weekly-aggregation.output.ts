import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { PersonalAccountDailyData } from '../entities/personal-account-daily-data.entity';

export type PersonalAccountDailyDataExtended = PersonalAccountDailyData & { year: number; month: number };

@ObjectType()
export class PersonalAccountWeeklyAggregationOutput {
	@Field(() => String, {
		description: 'Id = Year-Month-Week',
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

	@Field(() => [PersonalAccountWeeklyAggregationDataOutput], {
		defaultValue: [],
	})
	data: PersonalAccountWeeklyAggregationDataOutput[];
}

@ObjectType()
export class PersonalAccountWeeklyAggregationDataOutput {
	@Field(() => Float, {
		description: 'Sum of values for a specific personalAccountTagId',
	})
	value: number;

	@Field(() => Int, {
		description: 'How many entries per personalAccountTagId per week there were',
	})
	entries: number;

	@Field(() => String, {
		description: 'Reference to PersonalAccountTag.id',
	})
	tagId: string;
}

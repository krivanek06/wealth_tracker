import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { PersonalAccountDailyData as PersonalAccountDailyDataClient } from '@prisma/client';

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

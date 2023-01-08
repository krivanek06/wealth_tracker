import { Field, ObjectType } from '@nestjs/graphql';
import { IsObject } from 'class-validator';
import { PersonalAccountDailyDataOutput } from './personal-account-daily-data.output';

@ObjectType()
export class PersonalAccountDailyDataEditOutput {
	@Field(() => PersonalAccountDailyDataOutput, {
		description: 'Original object before edit',
	})
	@IsObject()
	originalDailyData: PersonalAccountDailyDataOutput;

	@Field(() => PersonalAccountDailyDataOutput, {
		description: 'Edited object',
	})
	@IsObject()
	modifiedDailyData: PersonalAccountDailyDataOutput;
}

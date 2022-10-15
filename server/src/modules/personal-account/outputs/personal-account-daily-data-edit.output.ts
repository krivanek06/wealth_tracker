import { Field, ObjectType } from '@nestjs/graphql';
import { IsObject } from 'class-validator';
import { PersonalAccountDailyData } from '../entities';

@ObjectType()
export class PersonalAccountDailyDataEditOutput {
	@Field(() => PersonalAccountDailyData, {
		description: 'Original object before edit',
	})
	@IsObject()
	originalDailyData: PersonalAccountDailyData;

	@Field(() => PersonalAccountDailyData, {
		description: 'Edited object',
	})
	@IsObject()
	modifiedDailyData: PersonalAccountDailyData;
}

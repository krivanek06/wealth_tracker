import { Field, ObjectType } from '@nestjs/graphql';
import { PersonalAccountDailyData, PersonalAccountTag } from '../entities';

@ObjectType()
export class PersonalAccountDailyDataOutput extends PersonalAccountDailyData {
	@Field(() => PersonalAccountTag, {
		description: 'Reference by PersonalAccountDailyData.tagId',
	})
	tag: PersonalAccountTag;
}

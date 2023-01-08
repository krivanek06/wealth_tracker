import { ArgsType, Field, InputType, Int } from '@nestjs/graphql';
import { MaxLength } from 'class-validator';

@InputType()
@ArgsType()
export class PersonalAccountDailyDataQuery {
	@Field(() => String, {
		description: 'Id of personal account to which this entry will be added',
	})
	@MaxLength(50)
	personalAccountId: string;

	@Field(() => Int, {
		description: 'Which year to query daily data',
	})
	year: number;

	@Field(() => Int, {
		description: 'Which year to query daily data',
	})
	month: number;
}

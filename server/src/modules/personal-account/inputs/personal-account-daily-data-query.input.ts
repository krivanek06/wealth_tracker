import { ArgsType, Field, InputType, Int } from '@nestjs/graphql';

@InputType()
@ArgsType()
export class PersonalAccountDailyDataQuery {
	@Field(() => Int, {
		description: 'Which year to query daily data',
	})
	year: number;

	@Field(() => Int, {
		description: 'Which year to query daily data',
	})
	month: number;
}

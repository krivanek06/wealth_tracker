import { ArgsType, Field, Float, InputType } from '@nestjs/graphql';
import { IsDate, MaxLength, Min } from 'class-validator';

@InputType()
@ArgsType()
export class PersonalAccountDailyDataCreate {
	@Field(() => String, {
		description: 'Which tag to associate this entry',
	})
	@MaxLength(50)
	tagId: string;

	@Field(() => Float, {
		description: 'How much value (amount) shall be added to the account',
	})
	@Min(0)
	value: number;

	@Field(() => String, {
		description: 'Description to daily data',
		defaultValue: '',
	})
	@MaxLength(80)
	description: string;

	@Field(() => String, {
		description: 'Id of personal account to which this entry will be added',
	})
	@MaxLength(50)
	personalAccountId: string;

	@Field(() => String, {
		description: 'Date (past, current, future) to which assign this entry. Timezone difference for current date',
	})
	@IsDate()
	date: string;
}

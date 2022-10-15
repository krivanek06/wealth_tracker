import { ArgsType, Field, InputType } from '@nestjs/graphql';
import { MaxLength } from 'class-validator';

@InputType()
@ArgsType()
export class PersonalAccountDailyDataDelete {
	@Field(() => String)
	@MaxLength(100)
	dailyDataId: string;

	@Field(() => String)
	@MaxLength(100)
	personalAccountId: string;

	@Field(() => String)
	@MaxLength(100)
	monthlyDataId: string;
}

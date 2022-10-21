import { ArgsType, Field, InputType } from '@nestjs/graphql';
import { MaxLength } from 'class-validator';

@InputType()
@ArgsType()
export class PersonalAccountMonthlyDataSeach {
	@Field(() => String, {
		description: 'Monthly data Id',
	})
	@MaxLength(50)
	id: string;

	@Field(() => String, {
		description: 'Personal account Id',
	})
	@MaxLength(50)
	personalAccountId: string;
}

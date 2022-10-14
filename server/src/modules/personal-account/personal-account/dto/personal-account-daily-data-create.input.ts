import { ArgsType, Field, Float, InputType } from '@nestjs/graphql';
import { MaxLength, Min } from 'class-validator';

@InputType()
@ArgsType()
export class PersonalAccountDailyDataCreate {
	@Field(() => String)
	@MaxLength(50)
	tagId: string;

	@Field(() => Float)
	@Min(0)
	value: number;
}

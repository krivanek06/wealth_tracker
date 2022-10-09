import { Field, Float } from '@nestjs/graphql';
import { MaxLength, Min } from 'class-validator';

export class PersonalAccountDailyDataCreate {
	@Field(() => String)
	@MaxLength(50)
	tagId: string;

	@Field(() => Float)
	@Min(0)
	value: number;
}

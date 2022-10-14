import { Field, Float } from '@nestjs/graphql';
import { MaxLength, Min } from 'class-validator';

export class PersonalAccountDailyDataEdit {
	@Field(() => String)
	@MaxLength(300)
	id: string;

	@Field(() => String)
	@MaxLength(50)
	tagId: string;

	@Field(() => Float)
	@Min(0)
	value: number;
}

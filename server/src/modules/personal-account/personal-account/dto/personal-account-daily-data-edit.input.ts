import { ArgsType, Field, Float, InputType } from '@nestjs/graphql';
import { IsDate, MaxLength, Min } from 'class-validator';

@InputType()
@ArgsType()
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

	@Field(() => String, {
		nullable: true,
		description: 'Date (past, current, future) to which assign this entry. If not provided, keep old date',
	})
	@IsDate()
	date?: string | null;
}

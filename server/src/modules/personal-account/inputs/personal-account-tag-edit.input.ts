import { ArgsType, Field, Float, InputType } from '@nestjs/graphql';
import { MaxLength, Min } from 'class-validator';

@InputType()
@ArgsType()
export class PersonalAccountTagDataEdit {
	@Field(() => String)
	@MaxLength(100)
	id: string;

	@Field(() => String)
	@MaxLength(30)
	name: string;

	@Field(() => String)
	@MaxLength(8)
	color: string;

	@Field(() => String)
	@MaxLength(100)
	imageUrl: string;

	@Field(() => Float, {
		defaultValue: null,
	})
	@Min(0)
	budgetMonthly?: number;
}

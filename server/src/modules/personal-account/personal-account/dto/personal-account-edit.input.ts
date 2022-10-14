import { ArgsType, Field, InputType } from '@nestjs/graphql';
import { MaxLength } from 'class-validator';

@InputType()
@ArgsType()
export class PersonalAccountEditInput {
	@Field(() => String)
	@MaxLength(100)
	id: string;

	@Field(() => String)
	@MaxLength(50)
	name: string;
}

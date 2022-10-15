import { ArgsType, Field, InputType } from '@nestjs/graphql';
import { MaxLength } from 'class-validator';

@InputType()
@ArgsType()
export class PersonalAccountCreateInput {
	@Field(() => String)
	@MaxLength(50)
	name: string;
}

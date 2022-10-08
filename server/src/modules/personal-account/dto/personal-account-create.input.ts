import { ArgsType, Field, InputType } from '@nestjs/graphql';
import { PersonalAccountTagDataType } from '@prisma/client';
import { IsOptional, MaxLength } from 'class-validator';

@InputType()
@ArgsType()
export class PersonalAccountCreateInput {
	@Field(() => String)
	@MaxLength(30)
	name: string;

	@Field(() => PersonalAccountTagDataType)
	type: PersonalAccountTagDataType;

	@Field(() => String)
	@IsOptional()
	@MaxLength(100)
	accountSpecific?: string;
}

import { ArgsType, Field, InputType } from '@nestjs/graphql';
import { PersonalAccountTagDataType } from '@prisma/client';
import { MaxLength } from 'class-validator';

@InputType()
@ArgsType()
export class PersonalAccountTagDataCreate {
	@Field(() => String)
	@MaxLength(30)
	name: string;

	@Field(() => PersonalAccountTagDataType)
	type: PersonalAccountTagDataType;

	@Field(() => String)
	@MaxLength(8)
	color: string;

	@Field(() => String)
	@MaxLength(100)
	imageUrl: string;

	@Field(() => String)
	@MaxLength(100)
	personalAccountId: string;
}

import { ArgsType, Field, InputType } from '@nestjs/graphql';
import { MaxLength } from 'class-validator';

@InputType()
@ArgsType()
export class PersonalAccountCreateInput {
	@Field(() => String)
	@MaxLength(50)
	name: string;

	@Field(() => AccountType)
	type: AccountType;
}

export enum AccountType {
	PERSONAL = 'PERSONAL',
	INVESTTMENT = 'INVESTTMENT',
}

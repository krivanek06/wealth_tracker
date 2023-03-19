import { ArgsType, Field, InputType } from '@nestjs/graphql';
import { MaxLength } from 'class-validator';

@InputType()
@ArgsType()
export class InvestmentAccountCreateInput {
	@Field(() => String)
	@MaxLength(50)
	name: string;
}

// ----------- Edit ------------

@InputType()
@ArgsType()
export class InvestmentAccountEditInput {
	@Field(() => String)
	@MaxLength(50)
	name: string;
}

// ----------- Delete ------------

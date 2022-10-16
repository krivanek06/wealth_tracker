import { ArgsType, Field, InputType } from '@nestjs/graphql';
import { MaxLength } from 'class-validator';

@InputType()
@ArgsType()
export class InvestmentAccountCreateInput {
	@Field(() => String)
	@MaxLength(50)
	name: string;
}

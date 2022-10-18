import { ArgsType, Field, InputType, Int } from '@nestjs/graphql';
import { MaxLength, Min } from 'class-validator';

@InputType()
@ArgsType()
export class InvestmentAccountEditInput {
	@Field(() => String)
	@MaxLength(50)
	investmentAccountId: string;

	@Field(() => String)
	@MaxLength(50)
	name: string;

	@Field(() => Int)
	@Min(0)
	cashCurrent: number;
}

import { ArgsType, Field, Float, InputType } from '@nestjs/graphql';
import { InvestmentAccountHoldingType } from '@prisma/client';
import { Min } from 'class-validator';

@InputType()
@ArgsType()
export class InvestmentAccounHoldingCreateInput {
	@Field(() => String, {
		description: 'Symbol ID',
	})
	symbol: string;

	@Field(() => String, {
		description: 'Investment account associated with the asset',
	})
	investmentAccountId: string;

	@Field(() => InvestmentAccountHoldingType)
	type: InvestmentAccountHoldingType;

	@Field(() => Float, {
		description: 'How many units of this symbol user has',
	})
	@Min(0)
	units: number;

	@Field(() => Float, {
		description: 'Amount the user invested into this symbol',
	})
	investedAlready: number;
}

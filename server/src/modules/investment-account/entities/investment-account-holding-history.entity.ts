import { Field, Float, ObjectType } from '@nestjs/graphql';
import { InvestmentAccountHoldingHistory as InvestmentAccountHoldingHistoryClient } from '@prisma/client';

@ObjectType()
export class InvestmentAccountHoldingHistory implements InvestmentAccountHoldingHistoryClient {
	@Field(() => String)
	itemId: string;

	@Field(() => String)
	date: string;

	@Field(() => Float)
	units: number;

	@Field(() => Float)
	investedAmount: number;
}

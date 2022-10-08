import { Field, Float, ObjectType } from '@nestjs/graphql';
import { InvestmentAccount as InvestmentAccountClient } from '@prisma/client';
import { InvestmentAccountHoldings, InvestmentAccountPortfolioSnapshot } from './../dto/';

@ObjectType()
export class InvestmentAccount implements InvestmentAccountClient {
	@Field(() => String)
	id: string;

	@Field(() => Float, {
		description: 'How much cash on hand is on this investment account',
	})
	cashCurrent: number;

	@Field(() => [InvestmentAccountHoldings])
	holdings: InvestmentAccountHoldings[];

	@Field(() => InvestmentAccountPortfolioSnapshot, {
		description: 'Last inserted data in InvestmentAccountHistory.portfolioSnapshots',
	})
	lastPortfolioSnapshot: InvestmentAccountPortfolioSnapshot;

	@Field(() => String, {
		description: 'Reference to User.ID who created this investment account',
	})
	userId: string;

	@Field(() => String, {
		description: 'Reference to InvestmentAccountHistory.ID who for 1-o-1 relashion',
	})
	investmentAccountHistoryId: string;
}

import { Field, Float, ObjectType } from '@nestjs/graphql';
import { InvestmentAccount as InvestmentAccountClient } from '@prisma/client';
import { InvestmentAccountHolding } from './investment-account-holding.entity';
import { InvestmentAccountPortfolioSnapshot } from './investment-account-portfolio-snapshot.entity';

@ObjectType()
export class InvestmentAccount implements InvestmentAccountClient {
	@Field(() => String)
	id: string;

	@Field(() => String, {
		description: 'custom name for personal account',
	})
	name: string;

	@Field(() => Float, {
		description: 'How much cash on hand is on this investment account',
	})
	cashCurrent: number;

	@Field(() => [InvestmentAccountHolding], {
		description: 'All assets user hold in his InvestmentAccount',
		defaultValue: [],
	})
	holdings: InvestmentAccountHolding[];

	@Field(() => InvestmentAccountPortfolioSnapshot, {
		nullable: true,
		description: 'Last inserted data in InvestmentAccountHistory.portfolioSnapshots',
	})
	lastPortfolioSnapshot: InvestmentAccountPortfolioSnapshot | null;

	@Field(() => String, {
		description: 'Reference to User.ID who created this investment account',
	})
	userId: string;

	@Field(() => [String], {
		description: 'ID of stocks that is in this investment account',
	})
	assetStocks: string[];
}

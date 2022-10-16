import { Field, Int, ObjectType } from '@nestjs/graphql';
import { InvestmentAccountHistory as InvestmentAccountHistoryClient } from '@prisma/client';
import { InvestmentAccountPortfolioSnapshot } from '../outputs';

@ObjectType()
export class InvestmentAccountHistory implements InvestmentAccountHistoryClient {
	@Field(() => String)
	id: string;

	@Field(() => Int, {
		description: 'Total portfolioSnapshot.length',
	})
	portfolioSnapshotTotal: number;

	@Field(() => InvestmentAccountPortfolioSnapshot, {
		description: 'Historical snapshots of portfolio change',
	})
	portfolioSnapshots: InvestmentAccountPortfolioSnapshot[];
}

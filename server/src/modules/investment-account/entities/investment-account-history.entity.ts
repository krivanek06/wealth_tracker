import { Field, Int, ObjectType } from '@nestjs/graphql';
import { InvestmentAccountHistory as InvestmentAccountHistoryClient } from '@prisma/client';
import { InvestmentAccountPortfolioSnapshot } from './investment-account-portfolio-snapshot.entity';

@ObjectType()
export class InvestmentAccountHistory implements InvestmentAccountHistoryClient {
	@Field(() => String)
	id: string;

	@Field(() => String, {
		description: 'Reference to InvestmentAccount.ID who for 1-o-1 relashion',
	})
	investmentAccountId: string;

	@Field(() => Int, {
		description: 'Total portfolioSnapshot.length',
	})
	portfolioSnapshotTotal: number;

	@Field(() => InvestmentAccountPortfolioSnapshot, {
		description: 'Total portfolioSnapshot.length',
	})
	portfolioSnapshots: InvestmentAccountPortfolioSnapshot[];
}

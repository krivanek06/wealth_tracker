import { Field, Float, ObjectType } from '@nestjs/graphql';
import { InvestmentAccountPortfolioSnapshot as InvestmentAccountPortfolioSnapshotClient } from '@prisma/client';

@ObjectType()
export class InvestmentAccountPortfolioSnapshot implements InvestmentAccountPortfolioSnapshotClient {
	@Field(() => String)
	id: string;

	@Field(() => String)
	date: Date;

	@Field(() => Float, {
		description: 'how much cash user had on hands during this snapshot',
	})
	cash: number;

	@Field(() => Float, {
		description: 'current price of assets * units',
	})
	investmentCurrent: number;
}

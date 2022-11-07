import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import {
	InvestmentAccountPortfolioSnapshot as InvestmentAccountPortfolioSnapshotClient,
	InvestmentAccountPortfolioSnapshotInfo as InvestmentAccountPortfolioSnapshotInfoClient,
} from '@prisma/client';

@ObjectType()
export class InvestmentAccountPortfolioSnapshot implements InvestmentAccountPortfolioSnapshotClient {
	@Field(() => String)
	id: string;

	@Field(() => String)
	snapshotDate: Date;

	@Field(() => Float, {
		description: 'how much cash user had on hands during this snapshot',
	})
	cash: number;

	@Field(() => Float, {
		description: 'current price of assets * units',
	})
	investmentCurrent: number;

	@Field(() => InvestmentAccountPortfolioSnapshotInfo, {
		description: 'details about owned asset this time',
	})
	portfolioSnapshotInfo: InvestmentAccountPortfolioSnapshotInfo[];
}

@ObjectType()
export class InvestmentAccountPortfolioSnapshotInfo implements InvestmentAccountPortfolioSnapshotInfoClient {
	@Field(() => String, {
		description: 'Symbol name: AAPL, MSFT, BTC',
	})
	assetId: string;

	@Field(() => Float, {
		description: 'Asset closed price at the end of the day',
	})
	assetClosedPrice: number;

	@Field(() => String, {
		description: 'Sector to which the asset belongs: Technology, Health care, Crypto, Commodities',
	})
	assetSector: string;

	@Field(() => Int, {
		description: 'How many units of assets were owned this time',
	})
	units: number;

	@Field(() => Float, {
		description: 'How much invested amount was in this asset this time',
	})
	investedAmount: number;
}

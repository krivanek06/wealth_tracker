import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import {
	InvestmentAccountHistoryChange as InvestmentAccountHistoryChangeClient,
	InvestmentAccountHistoryChangeInfo as InvestmentAccountHistoryChangeInfoClient,
} from '@prisma/client';

@ObjectType()
export class InvestmentAccountHistoryChange implements InvestmentAccountHistoryChangeClient {
	@Field(() => String)
	id: string;

	@Field(() => String)
	investmentAccountId: string;

	@Field(() => String)
	assetId: string;

	@Field(() => [InvestmentAccountHistoryChangeInfo])
	historyChangeInfo: InvestmentAccountHistoryChangeInfo[];
}

@ObjectType()
export class InvestmentAccountHistoryChangeInfo implements InvestmentAccountHistoryChangeInfoClient {
	@Field(() => String)
	infoId: string;

	@Field(() => Float)
	assetClosedPrice: number;

	@Field(() => String)
	assetSector: string;

	@Field(() => Int)
	units: number;

	@Field(() => Float)
	investedAmount: number;

	@Field(() => String)
	date: Date;
}

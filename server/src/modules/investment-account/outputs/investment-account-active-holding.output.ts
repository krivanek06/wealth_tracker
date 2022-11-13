import { Field, ObjectType } from '@nestjs/graphql';
import { InvestmentAccountHoldingType } from '@prisma/client';
import { InvestmentAccountHoldingHistory } from '../entities';
import { AssetGeneral } from './../../asset-manager';

@ObjectType()
export class InvestmentAccountActiveHoldingOutput {
	@Field(() => String, {
		description: 'Symbol ID -> AAPL, MSFT, BTC',
	})
	id: string;

	@Field(() => String, {
		description: 'Symbol ID -> AAPL, MSFT, BTC',
	})
	assetId: string;

	@Field(() => String, {
		description: 'Associated InvestmentAccount.id',
	})
	investmentAccountId: string;

	@Field(() => InvestmentAccountHoldingType)
	type: InvestmentAccountHoldingType;

	@Field(() => String)
	sector: string;

	@Field(() => InvestmentAccountHoldingHistory, {
		description: 'How many units of this symbol user has',
	})
	currentHistory: InvestmentAccountHoldingHistory;

	@Field(() => AssetGeneral)
	assetGeneral: AssetGeneral;
}

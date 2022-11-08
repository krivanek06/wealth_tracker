import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import {
	InvestmentAccountHolding as InvestmentAccountHoldingClient,
	InvestmentAccountHoldingType,
} from '@prisma/client';
import { InvestmentAccountHoldingHistory } from './investment-account-holding-history.entity';

registerEnumType(InvestmentAccountHoldingType, {
	name: 'InvestmentAccountHoldingType',
});

@ObjectType()
export abstract class InvestmentAccountHolding implements InvestmentAccountHoldingClient {
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

	@Field(() => [InvestmentAccountHoldingHistory], {
		description: 'How many units of this symbol user has',
	})
	holdingHistory: InvestmentAccountHoldingHistory[];
}

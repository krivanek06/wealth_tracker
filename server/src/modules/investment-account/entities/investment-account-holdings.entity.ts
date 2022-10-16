import { Field, Float, ObjectType, registerEnumType } from '@nestjs/graphql';
import {
	InvestmentAccountHoldings as InvestmentAccountHoldingsClient,
	InvestmentAccountHoldingsType,
} from '@prisma/client';

registerEnumType(InvestmentAccountHoldingsType, {
	name: 'InvestmentAccountHoldingsType',
});

@ObjectType()
export class InvestmentAccountHoldings implements InvestmentAccountHoldingsClient {
	@Field(() => String)
	id: string;

	@Field(() => String, {
		description: 'Symbol ID from firebase',
	})
	symbol: string;

	@Field(() => InvestmentAccountHoldingsType)
	type: InvestmentAccountHoldingsType;

	@Field(() => Float, {
		description: 'How many units of this symbol user has',
	})
	units: number;

	@Field(() => Float, {
		description: 'Amount the user invested into this symbol',
	})
	investmentStarted: number;
}

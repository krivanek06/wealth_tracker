import { Field, Float, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import {
	InvestmentAccountHolding as InvestmentAccountHoldingClient,
	InvestmentAccountHoldingType,
} from '@prisma/client';

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
		description: 'Associated InvestmentAccount.id',
	})
	investmentAccountId: string;

	@Field(() => InvestmentAccountHoldingType)
	type: InvestmentAccountHoldingType;

	@Field(() => String)
	addedDate: Date;

	@Field(() => Int, {
		description: 'How many units of this symbol user has',
	})
	units: number;

	@Field(() => Float, {
		description: 'Amount the user invested into this symbol',
	})
	investedAlready: number;
}

import { Field, Float, ObjectType, registerEnumType } from '@nestjs/graphql';
import {
	InvestmentAccountHoldingHistory as InvestmentAccountHoldingHistoryClient,
	InvestmentAccountHoldingHistoryType,
} from '@prisma/client';

registerEnumType(InvestmentAccountHoldingHistoryType, {
	name: 'InvestmentAccountHoldingHistoryType',
});
@ObjectType()
export class InvestmentAccountHoldingHistory implements InvestmentAccountHoldingHistoryClient {
	@Field(() => String)
	itemId: string;

	@Field(() => String, {
		description: 'Symbol ID -> AAPL, MSFT, BTC',
	})
	assetId: string;

	@Field(() => String, {
		description: 'InvestmentAccountCashChange.ID if holding history affected cash change',
	})
	cashChangeId: string;

	@Field(() => String)
	date: string;

	@Field(() => Date, {
		description: 'Date when entry was created',
	})
	createdAt: Date;

	@Field(() => Float)
	units: number;

	@Field(() => Float)
	unitValue: number;

	@Field(() => InvestmentAccountHoldingHistoryType)
	type: InvestmentAccountHoldingHistoryType;

	@Field(() => Float, {
		nullable: true,
	})
	return: number | null;

	@Field(() => Float, {
		nullable: true,
	})
	returnChange: number | null;
}

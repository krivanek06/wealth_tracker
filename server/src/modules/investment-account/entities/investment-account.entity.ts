import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import {
	InvestmentAccount as InvestmentAccountClient,
	InvestmentAccountCashChange as InvestmentAccountCashChangeClient,
	InvestmentAccountCashChangeType,
} from '@prisma/client';
import { InvestmentAccountHolding } from './investment-account-holding.entity';

registerEnumType(InvestmentAccountCashChangeType, {
	name: 'InvestmentAccountCashChangeType',
});
@ObjectType()
export class InvestmentAccount implements InvestmentAccountClient {
	@Field(() => String)
	id: string;

	@Field(() => String, {
		description: 'custom name for personal account',
	})
	name: string;

	@Field(() => String, {
		description: 'Date time when account was created',
	})
	createdAt: Date;

	@Field(() => String, {
		description: 'Reference to User.ID who created this investment account',
	})
	userId: string;

	@Field(() => [InvestmentAccountCashChange], {
		description: 'History of changed cash value',
	})
	cashChange: InvestmentAccountCashChange[];

	@Field(() => [InvestmentAccountHolding], {
		description: 'Holding history of this asset',
	})
	holdings: InvestmentAccountHolding[];
}

@ObjectType()
export class InvestmentAccountCashChange implements InvestmentAccountCashChangeClient {
	@Field(() => String)
	itemId: string;

	@Field(() => Number)
	cashValue: number;

	@Field(() => String, {
		description: 'Format yyyy-MM-DD',
	})
	date: string;

	@Field(() => InvestmentAccountCashChangeType)
	type: InvestmentAccountCashChangeType;

	@Field(() => String, {
		nullable: true,
	})
	holdingHistoryId: string;
}

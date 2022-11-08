import { Field, ObjectType } from '@nestjs/graphql';
import {
	InvestmentAccount as InvestmentAccountClient,
	InvestmentAccountCashChange as InvestmentAccountCashChangeClient,
} from '@prisma/client';
import { InvestmentAccountHolding } from './investment-account-holding.entity';

@ObjectType()
export class InvestmentAccount implements InvestmentAccountClient {
	@Field(() => String)
	id: string;

	@Field(() => String, {
		description: 'custom name for personal account',
	})
	name: string;

	@Field(() => String, {
		description: 'Reference to User.ID who created this investment account',
	})
	userId: string;

	@Field(() => InvestmentAccountCashChange, {
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
	cashCurrent: number;

	@Field(() => String)
	date: Date;
}

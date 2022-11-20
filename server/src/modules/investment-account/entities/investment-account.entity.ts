import { Field, ObjectType } from '@nestjs/graphql';
import { InvestmentAccount as InvestmentAccountClient } from '@prisma/client';
import { InvestmentAccountCashChange } from './investment-account-cash-change.entity';
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

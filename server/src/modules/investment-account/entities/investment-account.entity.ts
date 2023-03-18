import { Field, ObjectType } from '@nestjs/graphql';
import { InvestmentAccount as InvestmentAccountClient } from '@prisma/client';
import { AccountIdentification } from './../../account-manager/entities';

import { InvestmentAccountCashChange } from './investment-account-cash-change.entity';
import { InvestmentAccountHolding } from './investment-account-holding.entity';

@ObjectType()
export class InvestmentAccount extends AccountIdentification implements InvestmentAccountClient {
	@Field(() => [InvestmentAccountCashChange], {
		description: 'History of changed cash value',
	})
	cashChange: InvestmentAccountCashChange[];

	@Field(() => [InvestmentAccountHolding], {
		description: 'Holding history of this asset',
	})
	holdings: InvestmentAccountHolding[];
}

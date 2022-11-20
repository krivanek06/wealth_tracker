import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import {
	InvestmentAccountCashChange as InvestmentAccountCashChangeClient,
	InvestmentAccountCashChangeType,
} from '@prisma/client';

registerEnumType(InvestmentAccountCashChangeType, {
	name: 'InvestmentAccountCashChangeType',
});

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
}

import { Field, ObjectType } from '@nestjs/graphql';
import { InvestmentAccountHoldingType } from '@prisma/client';
import { InvestmentAccountHoldingHistory } from '../entities';

@ObjectType()
export class InvestmentAccountTransactionOutput extends InvestmentAccountHoldingHistory {
	@Field(() => InvestmentAccountHoldingType)
	holdingType: InvestmentAccountHoldingType;

	@Field(() => String)
	sector: string;
}

// ----------------------

@ObjectType()
export class InvestmentAccountTransactionWrapperOutput {
	@Field(() => [InvestmentAccountTransactionOutput], {
		description: 'list of best transaction by value change (%)',
		defaultValue: [],
	})
	bestValueChage: InvestmentAccountTransactionOutput[];

	@Field(() => [InvestmentAccountTransactionOutput], {
		description: 'list of worst transaction by value change (%)',
		defaultValue: [],
	})
	worstValueChage: InvestmentAccountTransactionOutput[];

	@Field(() => [InvestmentAccountTransactionOutput], {
		description: 'list of best transaction by value',
		defaultValue: [],
	})
	bestValue: InvestmentAccountTransactionOutput[];

	@Field(() => [InvestmentAccountTransactionOutput], {
		description: 'list of best transaction by value change',
		defaultValue: [],
	})
	worstValue: InvestmentAccountTransactionOutput[];
}

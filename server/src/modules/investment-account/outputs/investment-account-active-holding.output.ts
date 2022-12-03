import { Field, Float, ObjectType } from '@nestjs/graphql';
import { InvestmentAccountHoldingType } from '@prisma/client';
import { AssetGeneral } from './../../asset-manager';
import { InvestmentAccountTransactionOutput } from './investment-account-transaction.output';

@ObjectType()
export class InvestmentAccountActiveHoldingOutput {
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

	@Field(() => Float, {
		description: 'Total units for the active holding',
	})
	units: number;

	@Field(() => Float)
	totalValue: number;

	@Field(() => Float)
	beakEvenPrice: number;

	@Field(() => AssetGeneral)
	assetGeneral: AssetGeneral;
}

@ObjectType()
export class InvestmentAccountActiveHoldingOutputWrapper {
	@Field(() => InvestmentAccountActiveHoldingOutput, {
		description: 'Modified active holding current data',
	})
	holdingOutput: InvestmentAccountActiveHoldingOutput;

	@Field(() => InvestmentAccountTransactionOutput, {
		description: 'Transaction that was created',
	})
	transaction: InvestmentAccountTransactionOutput;
}

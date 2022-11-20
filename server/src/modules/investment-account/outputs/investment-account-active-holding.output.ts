import { Field, Float, ObjectType } from '@nestjs/graphql';
import { InvestmentAccountHoldingType } from '@prisma/client';
import { AssetGeneral } from './../../asset-manager';

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

	@Field(() => Float)
	units: number;

	@Field(() => Float)
	totalValue: number;

	@Field(() => Float)
	beakEvenPrice: number;

	@Field(() => AssetGeneral)
	assetGeneral: AssetGeneral;
}

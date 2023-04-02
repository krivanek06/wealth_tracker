import { Field, Float, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class InvestmentAccountGrowth {
	@Field(() => Float, {
		description: 'Accumulation of all invested assets in that specific date',
	})
	invested: number;

	@Field(() => Float)
	date: number;

	@Field(() => Float)
	ownedAssets: number;
}

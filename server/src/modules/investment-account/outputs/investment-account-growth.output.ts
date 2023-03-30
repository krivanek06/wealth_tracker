import { Field, Float, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class InvestmentAccountGrowth {
	@Field(() => Float, {
		description: 'Accumulation of all invested assets in that specific date',
	})
	invested: number;

	@Field(() => String)
	date: string;

	@Field(() => Float)
	ownedAssets: number;
}

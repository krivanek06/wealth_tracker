import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AssetGeneralSearch {
	@Field(() => String)
	symbol: string;

	@Field(() => String)
	name: string;

	@Field(() => String)
	currency: string;

	@Field(() => String)
	stockExchange: string;

	@Field(() => String)
	exchangeShortName: string;
}

import { Field, Float, ObjectType } from '@nestjs/graphql';
import { AssetGeneral as AssetGeneralClient, AssetGeneralQuote as AssetGeneralQuoteClient } from '@prisma/client';

@ObjectType()
export class AssetGeneralQuote implements AssetGeneralQuoteClient {
	@Field(() => String)
	symbol: string;

	@Field(() => String, {
		nullable: true,
	})
	symbolImageURL: string;

	@Field(() => String)
	name: string;

	@Field(() => Float)
	price: number;

	@Field(() => Float)
	changesPercentage: number;

	@Field(() => Float)
	change: number;

	@Field(() => Float)
	dayLow: number;

	@Field(() => Float)
	dayHigh: number;

	@Field(() => Float)
	volume: number;

	@Field(() => Float)
	yearLow: number;

	@Field(() => Float)
	yearHigh: number;

	@Field(() => Float)
	marketCap: number;

	@Field(() => Float)
	priceAvg50: number;

	@Field(() => Float)
	priceAvg200: number;

	@Field(() => Float)
	avgVolume: number;

	@Field(() => String)
	exchange: string;

	@Field(() => Float, {
		description: 'For crypto it is current supply',
	})
	sharesOutstanding: number;

	@Field(() => Float)
	timestamp: number;

	@Field(() => Float, {
		description: 'Only present for stocks',
		nullable: true,
	})
	eps: number | null;

	@Field(() => Float, {
		description: 'Only present for stocks',
		nullable: true,
	})
	pe: number | null;

	@Field(() => String, {
		description: 'Only present for stocks',
		nullable: true,
	})
	earningsAnnouncement: string | null;
}

@ObjectType()
export class AssetGeneral implements AssetGeneralClient {
	@Field(() => String)
	id: string;

	@Field(() => String)
	name: string;

	@Field(() => String, {
		nullable: true,
	})
	symbolImageURL: string;

	@Field(() => Date)
	assetIntoLastUpdate: Date;

	@Field(() => AssetGeneralQuote)
	assetQuote: AssetGeneralQuote;
}

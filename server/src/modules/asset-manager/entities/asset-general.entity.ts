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

	@Field(() => Float, {
		nullable: true,
		description: 'Null value of information was received during weekend',
	})
	dayLow: number | null;

	@Field(() => Float, {
		nullable: true,
		description: 'Null value of information was received during weekend',
	})
	dayHigh: number | null;

	@Field(() => Float)
	volume: number;

	@Field(() => Float, {
		nullable: true,
		description: 'Null very rarely when picking uncommon stock, like American Campus Communities',
	})
	yearLow: number | null;

	@Field(() => Float, {
		nullable: true,
		description: 'Null very rarely when picking uncommon stock, like American Campus Communities',
	})
	yearHigh: number | null;

	@Field(() => Float)
	marketCap: number;

	@Field(() => Float, {
		nullable: true,
		description: 'Null very rarely when picking uncommon stock, like American Campus Communities',
	})
	priceAvg50: number | null;

	@Field(() => Float, {
		nullable: true,
		description: 'Null very rarely when picking uncommon stock, like American Campus Communities',
	})
	priceAvg200: number | null;

	@Field(() => Float, {
		nullable: true,
		description: 'Null very rarely when picking uncommon stock, like American Campus Communities',
	})
	avgVolume: number | null;

	@Field(() => String)
	exchange: string;

	@Field(() => Float, {
		nullable: true,
		description: 'For crypto it is current supply, null should be rarely',
	})
	sharesOutstanding: number | null;

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

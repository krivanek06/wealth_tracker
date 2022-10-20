import { Field, Float, ObjectType } from '@nestjs/graphql';
import { AssetStockQuote as AssetStockQuoteClient } from '@prisma/client';

@ObjectType()
export class AssetStockQuote implements AssetStockQuoteClient {
	@Field(() => String)
	symbol: string;

	@Field(() => Float)
	price: number;

	@Field(() => Float)
	volume: number;

	@Field(() => String)
	name: string;

	@Field(() => Float)
	changesPercentage: number;

	@Field(() => Float)
	change: number;

	@Field(() => Float)
	dayLow: number;

	@Field(() => Float)
	dayHigh: number;

	@Field(() => Float)
	yearHigh: number;

	@Field(() => Float)
	yearLow: number;

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

	@Field(() => Float)
	open: number;

	@Field(() => Float)
	previousClose: number;

	@Field(() => Float, {
		nullable: true,
	})
	eps: number | null;

	@Field(() => Float, {
		nullable: true,
	})
	pe: number | null;

	@Field(() => String, {
		nullable: true,
	})
	earningsAnnouncement: string | null;

	@Field(() => Float)
	sharesOutstanding: number;

	@Field(() => Float)
	timestamp: number;
}

import { Field, Float, ObjectType } from '@nestjs/graphql';
import { AssetStock as AssetStockClient } from '@prisma/client';
import { AssetStockProfile } from './asset-stock-profile.entity';

@ObjectType()
export class AssetStock implements AssetStockClient {
	@Field(() => String)
	id: string;

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
	eps: number;

	@Field(() => Float, {
		nullable: true,
	})
	pe: number;

	@Field(() => String)
	earningsAnnouncement: Date;

	@Field(() => Float)
	sharesOutstanding: number;

	@Field(() => Float)
	timestamp: number;

	@Field(() => AssetStockProfile)
	assetStockProfile: AssetStockProfile;

	// relashional data
	investmentAccounts: string[];
}

import { Field, Float, ObjectType } from '@nestjs/graphql';
import { AssetStock as AssetStockClient } from '@prisma/client';
import { AssetStockProfile } from './asset-stock-profile.entity';
import { AssetStockQuote } from './asset-stock-quote.entity';

@ObjectType()
export class AssetStock implements AssetStockClient {
	@Field(() => String)
	symbol: string;

	@Field(() => Float)
	timestamp: number;

	@Field(() => AssetStockQuote)
	assetStockQuote: AssetStockQuote;

	@Field(() => AssetStockProfile)
	assetStockProfile: AssetStockProfile;
}

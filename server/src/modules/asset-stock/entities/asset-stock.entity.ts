import { Field, Float, ObjectType } from '@nestjs/graphql';
import { AssetStock as AssetStockClient } from '@prisma/client';
import { AssetStockProfile } from './asset-stock-profile.entity';
import { AssetStockQuote } from './asset-stock-quote.entity';

@ObjectType()
export class AssetStock implements AssetStockClient {
	@Field(() => String)
	symbol: string;

	@Field(() => Float, {
		description: 'Last time the price was updated for this stock',
	})
	priceUpdateTimestamp: number;

	@Field(() => Float, {
		description: 'Last time the information was updated for this stock',
	})
	infoUpdateTimestamp: number;

	@Field(() => AssetStockQuote)
	assetStockQuote: AssetStockQuote;

	@Field(() => AssetStockProfile)
	assetStockProfile: AssetStockProfile;
}

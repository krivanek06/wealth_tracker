import { Field, Float, ObjectType } from '@nestjs/graphql';
import {
	AssetGeneralHistoricalPrices as AssetGeneralHistoricalPricesClient,
	AssetGeneralHistoricalPricesData as AssetGeneralHistoricalPricesDataClient,
} from '@prisma/client';

@ObjectType()
export class AssetGeneralHistoricalPrices implements AssetGeneralHistoricalPricesClient {
	@Field(() => String, {
		description: 'Symbol Id - AAPL, MSFT, BTCUSD',
	})
	id: string;

	@Field(() => String)
	dateStart: string;

	@Field(() => String)
	dateEnd: string;

	@Field(() => [AssetGeneralHistoricalPricesData], {
		description: 'Historical prices to create charts for portoflio',
		defaultValue: [],
	})
	assetHistoricalPricesData: AssetGeneralHistoricalPricesData[];
}

@ObjectType()
export class AssetGeneralHistoricalPricesData implements AssetGeneralHistoricalPricesDataClient {
	@Field(() => String, {
		description: 'Format YYYY-MM-DD, i.e: 2022-03-12',
	})
	date: string;

	@Field(() => Float)
	close: number;
}

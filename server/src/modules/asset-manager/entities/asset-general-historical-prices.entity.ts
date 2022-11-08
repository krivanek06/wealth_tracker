import { Field, Float, ObjectType } from '@nestjs/graphql';
import {
	AssetGeneralHistoricalPrices as AssetGeneralHistoricalPricesClient,
	AssetGeneralHistoricalPricesData as AssetGeneralHistoricalPricesDataClient,
} from '@prisma/client';

@ObjectType()
export class AssetGeneralHistoricalPrices implements AssetGeneralHistoricalPricesClient {
	@Field(() => String)
	id: string;

	@Field(() => String)
	dateStart: Date;

	@Field(() => String)
	dateEnd: Date;

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
	open: number;

	@Field(() => Float)
	high: number;

	@Field(() => Float)
	low: number;

	@Field(() => Float)
	close: number;

	@Field(() => Float)
	volume: number;

	@Field(() => Float)
	change: number;

	@Field(() => Float)
	changePercent: number;
}

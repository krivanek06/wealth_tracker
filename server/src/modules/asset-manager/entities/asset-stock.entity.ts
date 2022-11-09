import { Field, ObjectType } from '@nestjs/graphql';
import { AssetStock as AssetStockClient, AssetStockProfile as AssetStockProfileClient } from '@prisma/client';

@ObjectType()
export class AssetStockProfile implements AssetStockProfileClient {
	@Field(() => String)
	companyName: string;

	@Field(() => String)
	currency: string;

	@Field(() => String)
	cik: string;

	@Field(() => String)
	isin: string;

	@Field(() => String)
	cusip: string;

	@Field(() => String)
	exchange: string;

	@Field(() => String)
	exchangeShortName: string;

	@Field(() => String)
	industry: string;

	@Field(() => String)
	website: string;

	@Field(() => String)
	description: string;

	@Field(() => String)
	ceo: string;

	@Field(() => String)
	sector: string;

	@Field(() => String)
	country: string;

	@Field(() => String)
	fullTimeEmployees: string;

	@Field(() => String)
	phone: string;

	@Field(() => String)
	address: string;

	@Field(() => String)
	city: string;

	@Field(() => String)
	state: string;

	@Field(() => String)
	zip: string;

	@Field(() => String)
	image: string;

	@Field(() => String)
	ipoDate: string;

	@Field(() => Boolean)
	defaultImage: boolean;

	@Field(() => Boolean)
	isEtf: boolean;

	@Field(() => Boolean)
	isActivelyTrading: boolean;

	@Field(() => Boolean)
	isAdr: boolean;

	@Field(() => Boolean)
	isFund: boolean;
}

@ObjectType()
export class AssetStock implements AssetStockClient {
	@Field(() => String)
	id: string;

	@Field(() => String, {
		description: 'Last time the information was updated for this stock',
	})
	lastUpdated: Date;

	@Field(() => AssetStockProfile, {
		description: 'More detail information about the stock',
	})
	profile: AssetStockProfile;
}

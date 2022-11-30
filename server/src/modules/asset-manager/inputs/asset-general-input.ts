import { ArgsType, Field, InputType } from '@nestjs/graphql';
import { IsDate, MaxLength } from 'class-validator';

@InputType()
@ArgsType()
export class AssetGeneralSearchInput {
	@Field(() => String)
	@MaxLength(10)
	symbolPrefix: string;

	@Field(() => Boolean, {
		defaultValue: false,
	})
	isCrypto: boolean;
}

@InputType()
@ArgsType()
export class AssetGeneralHistoricalPricesInput {
	@Field(() => String)
	@MaxLength(10)
	symbol: string;

	@Field(() => String)
	@IsDate()
	start: string;

	@Field(() => String)
	@IsDate()
	end: string;
}

@InputType()
@ArgsType()
export class AssetGeneralHistoricalPricesInputOnDate {
	@Field(() => String)
	@MaxLength(10)
	symbol: string;

	@Field(() => String)
	@IsDate()
	date: string;
}

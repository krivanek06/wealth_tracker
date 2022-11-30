import { UseGuards } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { AuthorizationGuard } from '../../../auth';
import { Input } from '../../../graphql';
import { AssetGeneral, AssetGeneralHistoricalPrices, AssetGeneralHistoricalPricesData } from '../entities';
import {
	AssetGeneralHistoricalPricesInput,
	AssetGeneralHistoricalPricesInputOnDate,
	AssetGeneralSearchInput,
} from '../inputs';
import { AssetGeneralService } from '../services';

@UseGuards(AuthorizationGuard)
@Resolver(() => AssetGeneral)
export class AssetGeneralResolver {
	constructor(private assetGeneralService: AssetGeneralService) {}

	@Query(() => [AssetGeneral], {
		description: 'Search asset based on symbol name',
		defaultValue: [],
	})
	searchAssetBySymbol(@Input() input: string): Promise<AssetGeneral[]> {
		return this.assetGeneralService.searchAssetBySymbolPrefixName(input);
	}

	@Query(() => [AssetGeneral], {
		description: 'Search asset based on symbol identification AAPL, BTC',
		defaultValue: [],
	})
	searchAssetBySymbolTickerPrefix(@Input() input: AssetGeneralSearchInput): Promise<AssetGeneral[]> {
		return this.assetGeneralService.searchAssetBySymbolTickerPrefix(input.symbolPrefix, input.isCrypto);
	}

	@Query(() => AssetGeneral, {
		nullable: true,
	})
	getAssetGeneralForSymbol(@Input() symbol: string): Promise<AssetGeneral | null> {
		return this.assetGeneralService.getAssetGeneralForSymbol(symbol);
	}

	@Query(() => [AssetGeneral], {
		defaultValue: [],
	})
	getAssetGeneralForSymbols(
		@Args({ name: 'symbols', type: () => [String] }) symbols: string[]
	): Promise<AssetGeneral[]> {
		return this.assetGeneralService.getAssetGeneralForSymbols(symbols);
	}

	@Query(() => AssetGeneralHistoricalPrices, {
		description: 'Historical prices for an Asset',
	})
	getAssetHistoricalPricesStartToEnd(
		@Input() input: AssetGeneralHistoricalPricesInput
	): Promise<AssetGeneralHistoricalPrices> {
		return this.assetGeneralService.getAssetHistoricalPricesStartToEnd(input.symbol, input.start, input.end);
	}

	@Query(() => AssetGeneralHistoricalPricesData, {
		description: 'Historical price for an Asset',
	})
	getAssetGeneralHistoricalPricesDataOnDate(
		@Input() input: AssetGeneralHistoricalPricesInputOnDate
	): Promise<AssetGeneralHistoricalPricesData> {
		return this.assetGeneralService.getAssetGeneralHistoricalPricesDataOnDate(input.symbol, input.date);
	}
}

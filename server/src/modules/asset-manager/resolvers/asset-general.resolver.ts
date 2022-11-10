import { UseGuards } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { AuthorizationGuard } from '../../../auth';
import { Input } from '../../../graphql';
import { AssetGeneral, AssetGeneralHistoricalPrices } from '../entities';
import { AssetGeneralHistoricalPricesInput, AssetGeneralSearchInput } from '../inputs';
import { AssetGeneralService } from '../services';

@UseGuards(AuthorizationGuard)
@Resolver(() => AssetGeneral)
export class AssetGeneralResolver {
	constructor(private assetGeneralService: AssetGeneralService) {}

	@Query(() => [AssetGeneral], {
		description: 'Search asset based on symbol',
		defaultValue: [],
	})
	searchAssetBySymbol(@Input() input: AssetGeneralSearchInput): Promise<AssetGeneral[]> {
		return this.assetGeneralService.searchAssetBySymbol(input.symbolPrefix, input.isCrypto);
	}

	@Query(() => [AssetGeneral], {
		defaultValue: [],
	})
	getAssetGeneralInformationForSymbols(
		@Args({ name: 'symbols', type: () => [String] }) symbols: string[]
	): Promise<AssetGeneral[]> {
		return this.assetGeneralService.getAssetGeneralInformationForSymbols(symbols);
	}

	@Query(() => AssetGeneralHistoricalPrices, {
		description: 'Historical prices for an Asset',
	})
	getAssetHistoricalPricesStartToEnd(
		@Input() input: AssetGeneralHistoricalPricesInput
	): Promise<AssetGeneralHistoricalPrices> {
		return this.assetGeneralService.getAssetHistoricalPricesStartToEnd(input.symbol, input.start, input.end);
	}
}

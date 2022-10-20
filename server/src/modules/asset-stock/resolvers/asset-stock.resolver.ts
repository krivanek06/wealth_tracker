import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { Input } from '../../../graphql';
import { AssetStock } from '../entities';
import { AssetStockSearch } from '../outputs';
import { FinancialModelingAPIService } from './../../../api';
import { AuthorizationGuard } from './../../../auth';

@UseGuards(AuthorizationGuard)
@Resolver(() => AssetStock)
export class AssetStockResolver {
	constructor(private financialModelingAPIService: FinancialModelingAPIService) {}

	@Query(() => [AssetStockSearch], {
		description: 'Search stock based on ticker symbol',
		defaultValue: [],
	})
	searchAssetStockSymbol(@Input() symbolPrefix: string): Promise<AssetStockSearch[]> {
		return this.financialModelingAPIService.searchStockBySymbolPrefix(symbolPrefix);
	}

	// TODO: RESOLVER: resolve profile
}

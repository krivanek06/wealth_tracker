import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { FinancialModelingAPIService } from '../../../api';
import { AuthorizationGuard } from '../../../auth';
import { Input } from '../../../graphql';
import { AssetGeneral } from '../entities';
import { AssetGeneralSearch } from '../outputs';

@UseGuards(AuthorizationGuard)
@Resolver(() => AssetGeneral)
export class AssetGeneralResolver {
	constructor(private financialModelingAPIService: FinancialModelingAPIService) {}

	@Query(() => [AssetGeneralSearch], {
		description: 'Search asset based on symbol',
		defaultValue: [],
	})
	searchAssetStockSymbol(@Input() symbolPrefix: string, @Input() isCrypto = false): Promise<AssetGeneralSearch[]> {
		return this.financialModelingAPIService.searchAssetBySymbolPrefix(symbolPrefix, isCrypto);
	}
}

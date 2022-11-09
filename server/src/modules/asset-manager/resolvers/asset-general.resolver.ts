import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { AuthorizationGuard } from '../../../auth';
import { Input } from '../../../graphql';
import { AssetGeneral } from '../entities';
import { AssetGeneralSearchInput } from '../inputs';
import { AssetGeneralSearch } from '../outputs';
import { AssetGeneralService } from '../services';

@UseGuards(AuthorizationGuard)
@Resolver(() => AssetGeneral)
export class AssetGeneralResolver {
	constructor(private assetGeneralService: AssetGeneralService) {}

	@Query(() => [AssetGeneralSearch], {
		description: 'Search asset based on symbol',
		defaultValue: [],
	})
	searchAssetBySymbol(@Input() input: AssetGeneralSearchInput): Promise<AssetGeneralSearch[]> {
		return this.assetGeneralService.searchAssetBySymbol(input.symbolPrefix, input.isCrypto);
	}
}

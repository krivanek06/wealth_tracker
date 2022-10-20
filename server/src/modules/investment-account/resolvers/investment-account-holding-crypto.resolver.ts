import { UseGuards } from '@nestjs/common';
import { Float, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { InvestmentAccountHoldingCrypto } from '../outputs';
import { AuthorizationGuard } from './../../../auth';
import { LodashServiceUtil } from './../../../utils';
import { AssetStockService } from './../../asset-stock';

@UseGuards(AuthorizationGuard)
@Resolver(() => InvestmentAccountHoldingCrypto)
export class InvestmentAccountHoldingCryptoResolver {
	constructor(private assetStockService: AssetStockService) {}

	// @ResolveField('assetInfo', () => AssetStock)
	// getStockAssetInfo(@Parent() holding: InvestmentAccountHoldingStock): Promise<AssetStock> {
	// 	return this.assetStockService.getStockBySymbol(holding.id);
	// }

	@ResolveField('breakEvenPrice', () => Float)
	getBreakEvenPrice(@Parent() holding: InvestmentAccountHoldingCrypto): number {
		const result = holding.investedAlready / holding.units;
		return LodashServiceUtil.round(result, 2);
	}
}

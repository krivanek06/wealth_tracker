import { UseGuards } from '@nestjs/common';
import { Float, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { InvestmentAccountHoldingStock } from '../outputs';
import { AuthorizationGuard } from './../../../auth';
import { LodashServiceUtil } from './../../../utils';
import { AssetStock, AssetStockService } from './../../asset-stock';

@UseGuards(AuthorizationGuard)
@Resolver(() => InvestmentAccountHoldingStock)
export class InvestmentAccountHoldingStockResolver {
	constructor(private assetStockService: AssetStockService) {}

	@ResolveField('assetInfo', () => AssetStock)
	getStockAssetInfo(@Parent() holding: InvestmentAccountHoldingStock): Promise<AssetStock> {
		return this.assetStockService.getStockBySymbol(holding.id);
	}

	@ResolveField('breakEvenPrice', () => Float)
	getBreakEvenPrice(@Parent() holding: InvestmentAccountHoldingStock): number {
		const result = holding.investedAlready / holding.units;
		return LodashServiceUtil.round(result, 2);
	}
}

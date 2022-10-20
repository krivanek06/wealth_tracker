import { UseGuards } from '@nestjs/common';
import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { InvestmentAccountHoldingStock } from '../outputs';
import { AuthorizationGuard } from './../../../auth';
import { AssetStock, AssetStockService } from './../../asset-stock';

@UseGuards(AuthorizationGuard)
@Resolver(() => InvestmentAccountHoldingStock)
export class InvestmentAccountHoldingStockResolver {
	constructor(private assetStockService: AssetStockService) {}

	@ResolveField('assetInfo', () => AssetStock)
	getPortfolioTotal(@Parent() holding: InvestmentAccountHoldingStock): Promise<AssetStock> {
		return this.assetStockService.getStockBySymbol(holding.id);
	}
}

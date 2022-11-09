import { UseGuards } from '@nestjs/common';
import { Mutation, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { AuthorizationGuard, RequestUser, ReqUser } from '../../../auth';
import { Input } from '../../../graphql/args';
import { InvestmentAccountHolding, InvestmentAccountHoldingHistory } from '../entities';
import { InvestmentAccounHoldingCreateInput, InvestmentAccounHoldingHistoryDeleteInput } from '../inputs';
import { InvestmentAccountHoldingService } from '../services';
import { AssetGeneralService } from './../../asset-manager';

@UseGuards(AuthorizationGuard)
@Resolver(() => InvestmentAccountHolding)
export class InvestmentAccountHoldingResolver {
	constructor(
		private investmentAccountHoldingService: InvestmentAccountHoldingService,
		private assetGeneralService: AssetGeneralService
	) {}

	@Mutation(() => InvestmentAccountHolding)
	createInvestmentAccountHolding(
		@Input() input: InvestmentAccounHoldingCreateInput,
		@ReqUser() authUser: RequestUser
	): Promise<InvestmentAccountHolding> {
		return this.investmentAccountHoldingService.modifyInvestmentAccountHolding(input, authUser.id);
	}

	@Mutation(() => InvestmentAccountHoldingHistory)
	deleteInvestmentAccountHolding(
		@Input() input: InvestmentAccounHoldingHistoryDeleteInput,
		@ReqUser() authUser: RequestUser
	): Promise<InvestmentAccountHoldingHistory> {
		return this.investmentAccountHoldingService.deleteHoldingHistory(input, authUser.id);
	}

	/* Resolvers */

	@ResolveField('isActive', () => Boolean)
	isHoldingActive(@Parent() holding: InvestmentAccountHolding): boolean {
		return holding.holdingHistory[holding.holdingHistory.length - 1]?.units > 0;
	}

	// TODO load historical prices for each stock to create chart
	// @ResolveField('historicalPrices', () => [AssetGeneralHistoricalPrices])
	// getHoldingHistoricalPrices(): Promise<AssetGeneralHistoricalPrices[]> {
	// 	// TODO load historical prices for each stock to create chart
	// }
}

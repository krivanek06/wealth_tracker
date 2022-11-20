import { UseGuards } from '@nestjs/common';
import { Mutation, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { AuthorizationGuard, RequestUser, ReqUser } from '../../../auth';
import { Input } from '../../../graphql/args';
import { InvestmentAccountHolding, InvestmentAccountHoldingHistory } from '../entities';
import { InvestmentAccounHoldingCreateInput, InvestmentAccounHoldingHistoryDeleteInput } from '../inputs';
import { InvestmentAccountHoldingService } from '../services';
import { MomentServiceUtil } from './../../../utils';
import { AssetGeneralHistoricalPricesData, AssetGeneralService } from './../../asset-manager';

@UseGuards(AuthorizationGuard)
@Resolver(() => InvestmentAccountHolding)
export class InvestmentAccountHoldingResolver {
	constructor(
		private investmentAccountHoldingService: InvestmentAccountHoldingService,
		private assetGeneralService: AssetGeneralService
	) {}
	/* Queries */

	/**
	 * TODO complete
	 * @param input
	 * @param authUser
	 * @returns active holdings for some specific date
	 */
	getInvestmentAccountActiveHoldingsForDate(): Promise<InvestmentAccountHolding[]> {
		return new Promise(() => []);
	}

	/* Mutations */

	@Mutation(() => InvestmentAccountHolding)
	createInvestmentAccountHolding(
		@Input() input: InvestmentAccounHoldingCreateInput,
		@ReqUser() authUser: RequestUser
	): Promise<InvestmentAccountHolding> {
		return this.investmentAccountHoldingService.createInvestmentAccountHolding(input, authUser.id);
	}

	@Mutation(() => InvestmentAccountHoldingHistory)
	deleteInvestmentAccountHolding(
		@Input() input: InvestmentAccounHoldingHistoryDeleteInput,
		@ReqUser() authUser: RequestUser
	): Promise<InvestmentAccountHoldingHistory> {
		return this.investmentAccountHoldingService.deleteHoldingHistory(input, authUser.id);
	}

	/* 
		TODO edit holding history, reason: may happane:
		- CREATE 1 BUY OPEATION
		- CREATE 2 BUY OPEATION
		- CREATE SELL OPERATION - calculates BEP, return & return %
		- DELETE first buy operation
		- incorrect data for the second buy opeation, need to manually adjust

	*/

	/* Resolvers */
	@ResolveField('historicalPrices', () => [AssetGeneralHistoricalPricesData], {
		description: 'Return historical data for a symbol starting from ',
	})
	async getHoldingHistoricalPrices(
		@Parent() holding: InvestmentAccountHolding
	): Promise<AssetGeneralHistoricalPricesData[]> {
		if (holding.holdingHistory.length === 0) {
			return [];
		}

		const result = await this.assetGeneralService.getAssetHistoricalPricesStartToEnd(
			holding.assetId,
			holding.holdingHistory[0].date,
			MomentServiceUtil.format(new Date())
		);
		return result.assetHistoricalPricesData;
	}
}

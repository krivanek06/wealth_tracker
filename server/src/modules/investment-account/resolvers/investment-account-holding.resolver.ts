import { UseGuards } from '@nestjs/common';
import { Mutation, Resolver } from '@nestjs/graphql';
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
}

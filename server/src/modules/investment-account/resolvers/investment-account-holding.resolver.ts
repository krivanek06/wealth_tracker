import { UseGuards } from '@nestjs/common';
import { Mutation, Resolver } from '@nestjs/graphql';
import { AuthorizationGuard, RequestUser, ReqUser } from '../../../auth';
import { Input } from '../../../graphql/args';
import { InvestmentAccountHolding, InvestmentAccountHoldingHistory } from '../entities';
import { InvestmentAccounHoldingCreateInput, InvestmentAccounHoldingHistoryDeleteInput } from '../inputs';
import { InvestmentAccountActiveHoldingOutputWrapper } from '../outputs';
import { InvestmentAccountHoldingService } from '../services';

@UseGuards(AuthorizationGuard)
@Resolver(() => InvestmentAccountHolding)
export class InvestmentAccountHoldingResolver {
	constructor(private investmentAccountHoldingService: InvestmentAccountHoldingService) {}
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

	@Mutation(() => InvestmentAccountActiveHoldingOutputWrapper)
	async createInvestmentAccountHolding(
		@Input() input: InvestmentAccounHoldingCreateInput,
		@ReqUser() authUser: RequestUser
	): Promise<InvestmentAccountActiveHoldingOutputWrapper> {
		const { holding, transaction } = await this.investmentAccountHoldingService.createInvestmentAccountHolding(
			input,
			authUser.id
		);
		// transform holding for symbol into InvestmentAccountActiveHoldingOutput
		const data = await this.investmentAccountHoldingService.getActiveHoldingOutput([holding]);
		return { holdingOutput: data[0], transaction };
	}

	@Mutation(() => InvestmentAccountHoldingHistory)
	deleteInvestmentAccountHolding(
		@Input() input: InvestmentAccounHoldingHistoryDeleteInput,
		@ReqUser() authUser: RequestUser
	): Promise<InvestmentAccountHoldingHistory> {
		return this.investmentAccountHoldingService.deleteHoldingHistory(input, authUser.id);
	}
}

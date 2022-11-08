import { UseGuards } from '@nestjs/common';
import { Mutation, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { AuthorizationGuard, RequestUser, ReqUser } from '../../../auth';
import { Input } from '../../../graphql/args';
import { InvestmentAccountHolding } from '../entities';
import {
	InvestmentAccounHoldingCreateInput,
	InvestmentAccounHoldingHistoryDeleteInput,
	InvestmentAccounHoldingHistoryEditInput,
} from '../inputs';
import { InvestmentAccountHoldingService } from '../services';

@UseGuards(AuthorizationGuard)
@Resolver(() => InvestmentAccountHolding)
export class InvestmentAccountHoldingResolver {
	constructor(private investmentAccountHoldingService: InvestmentAccountHoldingService) {}

	@Mutation(() => InvestmentAccountHolding)
	createInvestmentAccountHolding(
		@Input() input: InvestmentAccounHoldingCreateInput,
		@ReqUser() authUser: RequestUser
	): Promise<InvestmentAccountHolding> {
		return this.investmentAccountHoldingService.createInvestmentAccountHolding(input, authUser.id);
	}

	@Mutation(() => InvestmentAccountHolding)
	editInvestmentAccountHolding(
		@Input() input: InvestmentAccounHoldingHistoryEditInput,
		@ReqUser() authUser: RequestUser
	): Promise<InvestmentAccountHolding> {
		return this.investmentAccountHoldingService.editInvestmentAccountHolding(input, authUser.id);
	}

	@Mutation(() => InvestmentAccountHolding)
	deleteInvestmentAccountHolding(
		@Input() input: InvestmentAccounHoldingHistoryDeleteInput,
		@ReqUser() authUser: RequestUser
	): Promise<InvestmentAccountHolding> {
		return this.investmentAccountHoldingService.deleteInvestmentAccountHolding(input, authUser.id);
	}

	/* Resolvers */

	@ResolveField('isActive', () => Boolean)
	isHoldingActive(@Parent() holding: InvestmentAccountHolding): boolean {
		const holdingHistory = holding.holdingHistory;
		return holdingHistory.length > 0 ? holdingHistory[holdingHistory.length - 1].units > 0 : false;
	}
}

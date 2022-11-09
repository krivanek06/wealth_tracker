import { UseGuards } from '@nestjs/common';
import { Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { AuthorizationGuard, RequestUser, ReqUser } from '../../../auth';
import { Input } from '../../../graphql';
import { InvestmentAccount, InvestmentAccountHolding } from '../entities';
import { InvestmentAccountCreateInput, InvestmentAccountEditInput, InvestmentAccountGrowthInput } from '../inputs';
import { InvestmentAccountGrowth } from '../outputs';
import { InvestmentAccountService } from '../services';

@UseGuards(AuthorizationGuard)
@Resolver(() => InvestmentAccount)
export class InvestmentAccountResolver {
	constructor(private investmentAccountService: InvestmentAccountService) {}

	/* Queries */

	@Query(() => [InvestmentAccount], {
		description: 'Returns all personal accounts for the requester',
		defaultValue: [],
	})
	getInvestmentAccounts(@ReqUser() authUser: RequestUser): Promise<InvestmentAccount[]> {
		return this.investmentAccountService.getInvestmentAccounts(authUser.id);
	}

	@Query(() => [InvestmentAccountGrowth], {
		description: 'Returns the investment account history growth, based on the input values',
		defaultValue: [],
	})
	getInvestmentAccountGrowth(
		@ReqUser() authUser: RequestUser,
		@Input() input: InvestmentAccountGrowthInput
	): Promise<InvestmentAccountGrowth[]> {
		return this.investmentAccountService.getInvestmentAccountGrowth(input, authUser.id);
	}

	/* Mutation */

	@Mutation(() => InvestmentAccount)
	createInvestmentAccount(
		@ReqUser() authUser: RequestUser,
		@Input() input: InvestmentAccountCreateInput
	): Promise<InvestmentAccount> {
		return this.investmentAccountService.createInvestmentAccount(input, authUser.id);
	}

	@Mutation(() => InvestmentAccount)
	editInvestmentAccount(
		@ReqUser() authUser: RequestUser,
		@Input() input: InvestmentAccountEditInput
	): Promise<InvestmentAccount> {
		return this.investmentAccountService.editInvestmentAccount(input, authUser.id);
	}

	@Mutation(() => InvestmentAccount, {
		description: 'Returns the ID of the removed investment account',
	})
	deleteInvestmentAccount(
		@ReqUser() authUser: RequestUser,
		@Input() investmentAccountId: string
	): Promise<InvestmentAccount> {
		return this.investmentAccountService.deleteInvestmentAccount(investmentAccountId, authUser.id);
	}

	/* Resolvers */

	/**
	 * it is used to filter our in-active holdings from InvestmentAccount.holdings
	 */
	@ResolveField('activeHoldings', () => [InvestmentAccountHolding], {
		description: 'Returns holdings from an investment account that are active, meaning user has not solved them all',
		defaultValue: [],
	})
	getActiveHoldings(@Parent() investmentAccount: InvestmentAccount): InvestmentAccountHolding[] {
		return investmentAccount.holdings.filter((d) => d.holdingHistory[d.holdingHistory.length - 1].units > 0);
	}
}

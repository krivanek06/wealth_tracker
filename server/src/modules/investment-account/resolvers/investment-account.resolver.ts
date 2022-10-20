import { UseGuards } from '@nestjs/common';
import { Float, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { AuthorizationGuard, RequestUser, ReqUser } from '../../../auth';
import { Input } from '../../../graphql';
import { InvestmentAccount, InvestmentAccountHistory } from '../entities';
import { InvestmentAccountCreateInput, InvestmentAccountEditInput } from '../inputs';
import { InvestmentAccountHistoryService, InvestmentAccountService } from '../services';

@UseGuards(AuthorizationGuard)
@Resolver(() => InvestmentAccount)
export class InvestmentAccountResolver {
	constructor(
		private investmentAccountService: InvestmentAccountService,
		private investmentAccountHistoryService: InvestmentAccountHistoryService
	) {}

	/* Queries */

	@Query(() => [InvestmentAccount], {
		description: 'Returns all personal accounts for the requester',
		defaultValue: [],
	})
	getInvestmentAccounts(@ReqUser() authUser: RequestUser): Promise<InvestmentAccount[]> {
		return this.investmentAccountService.getInvestmentAccounts(authUser.id);
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

	@ResolveField('accountHistory', () => InvestmentAccountHistory)
	getInvestmentAccountHistory(@Parent() investmentAccount: InvestmentAccount): Promise<InvestmentAccountHistory> {
		return this.investmentAccountHistoryService.getInvestmentAccountHistoryInvestmentAccount(investmentAccount);
	}

	@ResolveField('investedAlreadyTotal', () => Float)
	getInvestedAlreadyTotal(@Parent() investmentAccount: InvestmentAccount): number {
		const holdingsInvestedAlready = investmentAccount.holdings.reduce((acc, curr) => acc + curr.investedAlready, 0);
		return holdingsInvestedAlready;
	}

	@ResolveField('portfolioBalanceTotal', () => Float)
	getPortfolioTotal(@Parent() investmentAccount: InvestmentAccount): number {
		const holdingsInvestedAlready = investmentAccount.holdings.reduce((acc, curr) => acc + curr.investedAlready, 0);
		return investmentAccount.cashCurrent + holdingsInvestedAlready;
	}
}

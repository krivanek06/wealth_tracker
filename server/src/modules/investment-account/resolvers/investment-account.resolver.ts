import { UseGuards } from '@nestjs/common';
import { Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { InvestmentAccount, InvestmentAccountHistory } from '../entities';
import { InvestmentAccountCreateInput, InvestmentAccountEditInput } from '../inputs';
import { InvestmentAccountHistoryService, InvestmentAccountService } from '../services';
import { AuthorizationGuard, RequestUser, ReqUser } from './../../../auth/';
import { Input } from './../../../graphql';

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
}

import { UseGuards } from '@nestjs/common';
import { Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { InvestmentAccount, InvestmentAccountHistory } from '../entities';
import { InvestmentAccountCreateInput } from '../inputs';
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

	// @Mutation(() => PersonalAccount)
	// editPersonalAccount(
	// 	@ReqUser() authUser: RequestUser,
	// 	@Input() input: PersonalAccountEditInput
	// ): Promise<PersonalAccount> {
	// 	return this.personalAccountService.editPersonalAccount(input, authUser.id);
	// }

	/* Resolvers */

	@ResolveField('accountHistory', () => InvestmentAccountHistory)
	getInvestmentAccountHistory(@Parent() investmentAccount: InvestmentAccount): Promise<InvestmentAccountHistory> {
		return this.investmentAccountHistoryService.getInvestmentAccountHistoryInvestmentAccount(investmentAccount);
	}
}

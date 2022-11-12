import { UseGuards } from '@nestjs/common';
import { Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { AuthorizationGuard, RequestUser, ReqUser } from '../../../auth';
import { Input } from '../../../graphql';
import { AssetGeneralService } from '../../asset-manager';
import { InvestmentAccount } from '../entities';
import { InvestmentAccountCreateInput, InvestmentAccountEditInput, InvestmentAccountGrowthInput } from '../inputs';
import { InvestmentAccountActiveHoldingOutput, InvestmentAccountGrowth } from '../outputs';
import { InvestmentAccountService } from '../services';

@UseGuards(AuthorizationGuard)
@Resolver(() => InvestmentAccount)
export class InvestmentAccountResolver {
	constructor(
		private investmentAccountService: InvestmentAccountService,
		private assetGeneralService: AssetGeneralService
	) {}

	/* Queries */

	@Query(() => [InvestmentAccount], {
		description: 'Returns all investment accounts for the requester',
		defaultValue: [],
	})
	getInvestmentAccounts(@ReqUser() authUser: RequestUser): Promise<InvestmentAccount[]> {
		return this.investmentAccountService.getInvestmentAccounts(authUser.id);
	}

	@Query(() => InvestmentAccount, {
		description: 'Returns investment account by id',
		defaultValue: [],
	})
	getInvestmentAccountsById(@ReqUser() authUser: RequestUser, @Input() input: string): Promise<InvestmentAccount> {
		return this.investmentAccountService.getInvestmentAccountsById(input);
	}

	// TODO: remove - will be calculated on the UI
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
	@ResolveField('activeHoldings', () => [InvestmentAccountActiveHoldingOutput], {
		description: 'Returns active holdings from an investment account, at least one unit is owned',
		defaultValue: [],
	})
	getActiveHoldings(@Parent() investmentAccount: InvestmentAccount): Promise<InvestmentAccountActiveHoldingOutput[]> {
		return this.investmentAccountService.getActiveHoldings(investmentAccount);
	}
}

import { UseGuards } from '@nestjs/common';
import { Float, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { AuthorizationGuard, RequestUser, ReqUser } from '../../../auth';
import { Input } from '../../../graphql';
import { InvestmentAccount } from '../entities';
import { InvestmentAccountEditInput, InvestmentAccountGrowthInput } from '../inputs';
import { InvestmentAccountActiveHoldingOutput, InvestmentAccountGrowth } from '../outputs';
import { InvestmentAccountHoldingService, InvestmentAccountService } from '../services';

@UseGuards(AuthorizationGuard)
@Resolver(() => InvestmentAccount)
export class InvestmentAccountResolver {
	constructor(
		private investmentAccountService: InvestmentAccountService,
		private investmentAccountHoldingService: InvestmentAccountHoldingService
	) {}

	/* Queries */
	@Query(() => InvestmentAccount, {
		description: 'Returns investment account for authenticated user',
		nullable: true,
	})
	getInvestmentAccountByUser(@ReqUser() authUser: RequestUser): Promise<InvestmentAccount | undefined> {
		return this.investmentAccountService.getInvestmentAccountByUserId(authUser.id);
	}

	// TODO: implement caching for assets historical prices: https://docs.nestjs.com/techniques/caching
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
	createInvestmentAccount(@ReqUser() authUser: RequestUser): Promise<InvestmentAccount> {
		return this.investmentAccountService.createInvestmentAccount(authUser.id);
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
	deleteInvestmentAccount(@ReqUser() authUser: RequestUser): Promise<InvestmentAccount> {
		return this.investmentAccountService.deleteInvestmentAccount(authUser.id);
	}

	/* Resolvers */

	/**
	 * it is used to filter our in-active holdings from InvestmentAccount.holdings
	 */
	@ResolveField('activeHoldings', () => [InvestmentAccountActiveHoldingOutput], {
		description: 'Returns active holdings from an investment account, at least one unit is owned',
		defaultValue: [],
		nullable: false,
	})
	getActiveHoldings(@Parent() investmentAccount: InvestmentAccount): Promise<InvestmentAccountActiveHoldingOutput[]> {
		const activeHoldings = this.investmentAccountHoldingService.filterOutActiveHoldings(investmentAccount);
		return this.investmentAccountHoldingService.getActiveHoldingOutput(activeHoldings);
	}

	/* Resolvers */
	@ResolveField('currentCash', () => Float, {
		description: 'Returns current cash holding',
		nullable: false,
	})
	getCurrentCash(@Parent() investmentAccount: InvestmentAccount): number {
		return this.investmentAccountService.getCurrentCashByAccount(investmentAccount.cashChange);
	}
}

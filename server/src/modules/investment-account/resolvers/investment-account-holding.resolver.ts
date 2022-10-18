import { UseGuards } from '@nestjs/common';
import { Float, Mutation, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { AuthorizationGuard, RequestUser, ReqUser } from '../../../auth';
import { InvestmentAccountHolding } from '../entities';
import {
	InvestmentAccounHoldingCreateInput,
	InvestmentAccounHoldingDeleteInput,
	InvestmentAccounHoldingEditInput,
} from '../inputs';
import { InvestmentAccountHoldingService } from '../services';
import { Input } from './../../../graphql/args';
import { LodashServiceUtil } from './../../../utils';

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
		@Input() input: InvestmentAccounHoldingEditInput,
		@ReqUser() authUser: RequestUser
	): Promise<InvestmentAccountHolding> {
		return this.investmentAccountHoldingService.editInvestmentAccountHolding(input, authUser.id);
	}

	@Mutation(() => InvestmentAccountHolding)
	deleteInvestmentAccountHolding(
		@Input() input: InvestmentAccounHoldingDeleteInput,
		@ReqUser() authUser: RequestUser
	): Promise<InvestmentAccountHolding> {
		return this.investmentAccountHoldingService.deleteInvestmentAccountHolding(input, authUser.id);
	}

	/* Resolvers */

	@ResolveField('breakEvenPrice', () => Float)
	getPortfolioTotal(@Parent() holding: InvestmentAccountHolding): number {
		const result = holding.investedAlready / holding.units;
		return LodashServiceUtil.round(result, 2);
	}
}

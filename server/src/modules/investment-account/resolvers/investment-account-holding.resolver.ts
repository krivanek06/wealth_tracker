import { UseGuards } from '@nestjs/common';
import { Mutation, Resolver } from '@nestjs/graphql';
import { AuthorizationGuard, RequestUser, ReqUser } from '../../../auth';
import { InvestmentAccountHolding } from '../entities';
import {
	InvestmentAccounHoldingCreateInput,
	InvestmentAccounHoldingDeleteInput,
	InvestmentAccounHoldingEditInput,
} from '../inputs';
import { InvestmentAccountHoldingService } from '../services';
import { Input } from './../../../graphql/args';

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
}

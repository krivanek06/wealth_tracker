import { UseGuards } from '@nestjs/common';
import { Mutation, Resolver } from '@nestjs/graphql';
import { AuthorizationGuard } from 'src/auth';
import { InvestmentAccountCashChange } from '../entities';
import {
	InvestmentAccountCashCreateInput,
	InvestmentAccountCashDeleteInput,
	InvestmentAccountCashEditInput,
} from '../inputs';
import { InvestmentAccountCashChangeService } from '../services';
import { RequestUser, ReqUser } from './../../../auth/';
import { Input } from './../../../graphql/args/';

@UseGuards(AuthorizationGuard)
@Resolver(() => InvestmentAccountCashChange)
export class InvestmentAccountCashChangeResolver {
	constructor(private investmentAccountCacheChangeService: InvestmentAccountCashChangeService) {}

	@Mutation(() => InvestmentAccountCashChange)
	createInvestmentAccountCashe(
		@Input() input: InvestmentAccountCashCreateInput,
		@ReqUser() authUser: RequestUser
	): Promise<InvestmentAccountCashChange> {
		return this.investmentAccountCacheChangeService.createInvestmentAccountCashe(input, authUser.id);
	}

	@Mutation(() => InvestmentAccountCashChange)
	editInvestmentAccountCashe(
		@Input() input: InvestmentAccountCashEditInput,
		@ReqUser() authUser: RequestUser
	): Promise<InvestmentAccountCashChange> {
		return this.investmentAccountCacheChangeService.editInvestmentAccountCashe(input, authUser.id);
	}

	@Mutation(() => InvestmentAccountCashChange)
	deleteInvestmentAccountCashe(
		@Input() input: InvestmentAccountCashDeleteInput,
		@ReqUser() authUser: RequestUser
	): Promise<InvestmentAccountCashChange> {
		return this.investmentAccountCacheChangeService.deleteInvestmentAccountCashe(input, authUser.id);
	}
}

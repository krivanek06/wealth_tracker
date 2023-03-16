import { Inject, UseGuards } from '@nestjs/common';
import { Mutation, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { PubSubEngine } from 'graphql-subscriptions';
import { AuthorizationGuard } from 'src/auth';
import { RequestUser, ReqUser } from '../../../auth/';
import { Input } from '../../../graphql/args/';
import { PUB_SUB } from '../../../graphql/graphql.types';
import { InvestmentAccountCashChange } from '../entities';
import {
	InvestmentAccountCashCreateInput,
	InvestmentAccountCashDeleteInput,
	InvestmentAccountCashEditInput,
} from '../inputs';
import { InvestmentAccountCashChangeService } from '../services';

@UseGuards(AuthorizationGuard)
@Resolver(() => InvestmentAccountCashChange)
export class InvestmentAccountCashChangeResolver {
	constructor(
		private investmentAccountCacheChangeService: InvestmentAccountCashChangeService,
		@Inject(PUB_SUB) private pubSub: PubSubEngine
	) {}

	@Mutation(() => InvestmentAccountCashChange)
	createInvestmentAccountCash(
		@Input() input: InvestmentAccountCashCreateInput,
		@ReqUser() authUser: RequestUser
	): Promise<InvestmentAccountCashChange> {
		return this.investmentAccountCacheChangeService.createInvestmentAccountCash(input, authUser.id);
	}

	@Mutation(() => InvestmentAccountCashChange)
	editInvestmentAccountCash(
		@Input() input: InvestmentAccountCashEditInput,
		@ReqUser() authUser: RequestUser
	): Promise<InvestmentAccountCashChange> {
		return this.investmentAccountCacheChangeService.editInvestmentAccountCash(input, authUser.id);
	}

	@Mutation(() => InvestmentAccountCashChange)
	deleteInvestmentAccountCash(
		@Input() input: InvestmentAccountCashDeleteInput,
		@ReqUser() authUser: RequestUser
	): Promise<InvestmentAccountCashChange> {
		return this.investmentAccountCacheChangeService.deleteInvestmentAccountCash(input, authUser.id);
	}

	/* Resolvers */

	@ResolveField('imageUrl', () => String, {
		description: 'Returns corresponding image url for the Cash Type',
	})
	getCashTypeImageUrl(@Parent() cashChange: InvestmentAccountCashChange): string {
		return this.investmentAccountCacheChangeService.getCashTypeImageUrl(cashChange);
	}
}

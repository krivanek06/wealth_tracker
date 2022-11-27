import { Inject, UseGuards } from '@nestjs/common';
import { Mutation, Resolver, Subscription } from '@nestjs/graphql';
import { PubSubEngine } from 'graphql-subscriptions';
import { AuthorizationGuard } from 'src/auth';
import { RequestUser, ReqUser } from '../../../auth/';
import { Input } from '../../../graphql/args/';
import { PUB_SUB } from '../../../graphql/graphql.types';
import { INVESTMENT_ACCOUNT_CASH_PUB_SUB } from '../dto';
import { InvestmentAccountCashChange } from '../entities';
import {
	InvestmentAccountCashCreateInput,
	InvestmentAccountCashDeleteInput,
	InvestmentAccountCashEditInput,
} from '../inputs';
import { InvestmentAccountCashChangeSubscription } from '../outputs';
import { InvestmentAccountCashChangeService } from '../services';

@UseGuards(AuthorizationGuard)
@Resolver(() => InvestmentAccountCashChange)
export class InvestmentAccountCashChangeResolver {
	constructor(
		private investmentAccountCacheChangeService: InvestmentAccountCashChangeService,
		@Inject(PUB_SUB) private pubSub: PubSubEngine
	) {}

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
		return this.investmentAccountCacheChangeService.editInvestmentAccountCash(input, authUser.id);
	}

	@Mutation(() => InvestmentAccountCashChange)
	deleteInvestmentAccountCashe(
		@Input() input: InvestmentAccountCashDeleteInput,
		@ReqUser() authUser: RequestUser
	): Promise<InvestmentAccountCashChange> {
		return this.investmentAccountCacheChangeService.deleteInvestmentAccountCash(input, authUser.id);
	}

	/* Subscriptions */

	@Subscription(() => InvestmentAccountCashChangeSubscription)
	cashModification() {
		return this.pubSub.asyncIterator(INVESTMENT_ACCOUNT_CASH_PUB_SUB);
	}
}

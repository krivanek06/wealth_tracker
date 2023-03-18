import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { AuthorizationGuard, RequestUser, ReqUser } from '../../../auth';
import { Input } from '../../../graphql/args';
import { InvestmentAccountTransactionInput } from '../inputs';
import { InvestmentAccountTransactionOutput, InvestmentAccountTransactionWrapperOutput } from '../outputs';
import { InvestmentAccountTransactionService } from '../services';

@UseGuards(AuthorizationGuard)
@Resolver(() => InvestmentAccountTransactionOutput)
export class InvestmentAccountTransactionResolver {
	constructor(private investmentAccountTransactionService: InvestmentAccountTransactionService) {}

	@Query(() => InvestmentAccountTransactionWrapperOutput, {
		description: 'Returns SOLD transaction in different orders',
	})
	getTopTransactions(@ReqUser() authUser: RequestUser): Promise<InvestmentAccountTransactionWrapperOutput> {
		return this.investmentAccountTransactionService.getTopTransactions(authUser.id);
	}

	@Query(() => [InvestmentAccountTransactionOutput], {
		description: 'Return by added transaction by same date key',
	})
	getTransactionHistory(
		@ReqUser() authUser: RequestUser,
		@Input() input: InvestmentAccountTransactionInput
	): Promise<InvestmentAccountTransactionOutput[]> {
		return this.investmentAccountTransactionService.getTransactionHistory(input, authUser.id);
	}

	@Query(() => [String], {
		description: 'All asset symbols that were ever inside holdings, some transaction were made by them',
		defaultValue: [],
	})
	getTransactionSymbols(@ReqUser() authUser: RequestUser): Promise<string[]> {
		return this.investmentAccountTransactionService.getTransactionSymbols(authUser.id);
	}
}

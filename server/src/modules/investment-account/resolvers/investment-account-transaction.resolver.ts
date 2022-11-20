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
	getTransactions(
		@ReqUser() authUser: RequestUser,
		@Input() input: string
	): Promise<InvestmentAccountTransactionWrapperOutput> {
		return this.investmentAccountTransactionService.getTransactions(input, authUser.id);
	}

	@Query(() => [InvestmentAccountTransactionOutput], {
		description: 'Return by added transaction by saome date key',
	})
	getTransactionHistory(
		@ReqUser() authUser: RequestUser,
		@Input() input: InvestmentAccountTransactionInput
	): Promise<InvestmentAccountTransactionOutput[]> {
		return this.investmentAccountTransactionService.getTransactionHistory(input, authUser.id);
	}
}

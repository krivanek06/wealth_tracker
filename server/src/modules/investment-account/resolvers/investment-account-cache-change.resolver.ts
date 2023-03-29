import { UseGuards } from '@nestjs/common';
import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { AuthorizationGuard } from 'src/auth';
import { InvestmentAccountCashChange } from '../entities';
import { InvestmentAccountCashChangeService } from '../services';

@UseGuards(AuthorizationGuard)
@Resolver(() => InvestmentAccountCashChange)
export class InvestmentAccountCashChangeResolver {
	constructor(private investmentAccountCacheChangeService: InvestmentAccountCashChangeService) {}

	/* Resolvers */

	@ResolveField('imageUrl', () => String, {
		description: 'Returns corresponding image url for the Cash Type',
	})
	getCashTypeImageUrl(@Parent() cashChange: InvestmentAccountCashChange): string {
		return this.investmentAccountCacheChangeService.getCashTypeImageUrl(cashChange);
	}
}

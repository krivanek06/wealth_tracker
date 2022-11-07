import { UseGuards } from '@nestjs/common';
import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { AuthorizationGuard } from '../../../auth';
import { InvestmentAccountHistory, InvestmentAccountPortfolioSnapshot } from '../entities';

@UseGuards(AuthorizationGuard)
@Resolver(() => InvestmentAccountHistory)
export class InvestmentAccountHistoryResolver {
	@ResolveField('lastPortfolioSnapshot', () => InvestmentAccountPortfolioSnapshot)
	getLastPortfolioSnapshot(@Parent() history: InvestmentAccountHistory): InvestmentAccountPortfolioSnapshot | null {
		return history.portfolioSnapshots[history.portfolioSnapshots.length - 1] ?? null;
	}
}

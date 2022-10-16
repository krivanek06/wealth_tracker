import { Module } from '@nestjs/common';
import { InvestmentAccountHistoryResolver, InvestmentAccountResolver } from './resolvers';
import { InvestmentAccountHistoryService, InvestmentAccountService } from './services';

@Module({
	providers: [
		InvestmentAccountService,
		InvestmentAccountResolver,
		InvestmentAccountHistoryService,
		InvestmentAccountHistoryResolver,
	],
	exports: [InvestmentAccountHistoryResolver, InvestmentAccountResolver],
})
export class InvestmentAccountModule {}

import { Module } from '@nestjs/common';
import { PrismaService } from './../../prisma';
import { InvestmentAccountHistoryResolver, InvestmentAccountResolver } from './resolvers';
import { InvestmentAccountHistoryService, InvestmentAccountService } from './services';

@Module({
	providers: [
		PrismaService,
		InvestmentAccountService,
		InvestmentAccountResolver,
		InvestmentAccountHistoryService,
		InvestmentAccountHistoryResolver,
	],
	exports: [InvestmentAccountHistoryResolver, InvestmentAccountResolver],
})
export class InvestmentAccountModule {}

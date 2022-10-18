import { Module } from '@nestjs/common';
import { PrismaService } from './../../prisma';
import {
	InvestmentAccountHistoryResolver,
	InvestmentAccountHoldingResolver,
	InvestmentAccountResolver,
} from './resolvers';
import { InvestmentAccountHistoryService, InvestmentAccountHoldingService, InvestmentAccountService } from './services';

@Module({
	providers: [
		PrismaService,
		InvestmentAccountService,
		InvestmentAccountResolver,
		InvestmentAccountHistoryService,
		InvestmentAccountHistoryResolver,
		InvestmentAccountHoldingService,
		InvestmentAccountHoldingResolver,
	],
	exports: [InvestmentAccountHistoryResolver, InvestmentAccountResolver, InvestmentAccountHoldingResolver],
})
export class InvestmentAccountModule {}

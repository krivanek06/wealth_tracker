import { forwardRef, Module } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { AssetStockModule } from '../asset-manager';
import {
	InvestmentAccountCashChangeResolver,
	InvestmentAccountHistoryResolver,
	InvestmentAccountHoldingResolver,
	InvestmentAccountResolver,
} from './resolvers';
import {
	InvestmentAccountCacheChangeService,
	InvestmentAccountHoldingHistoryService,
	InvestmentAccountHoldingService,
	InvestmentAccountService,
} from './services';

@Module({
	imports: [forwardRef(() => AssetStockModule)],
	providers: [
		PrismaService,
		InvestmentAccountService,
		InvestmentAccountResolver,
		InvestmentAccountHoldingHistoryService,
		InvestmentAccountHistoryResolver,
		InvestmentAccountHoldingService,
		InvestmentAccountHoldingResolver,
		InvestmentAccountCacheChangeService,
		InvestmentAccountCashChangeResolver,
	],
	exports: [
		InvestmentAccountHistoryResolver,
		InvestmentAccountResolver,
		InvestmentAccountHoldingResolver,
		InvestmentAccountCashChangeResolver,
	],
})
export class InvestmentAccountModule {}

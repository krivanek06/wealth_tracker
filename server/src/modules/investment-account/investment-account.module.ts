import { forwardRef, Module } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { AssetStockModule } from '../asset-stock';
import {
	InvestmentAccountHistoryResolver,
	InvestmentAccountHoldingResolver,
	InvestmentAccountResolver,
} from './resolvers';
import { InvestmentAccountHistoryService, InvestmentAccountHoldingService, InvestmentAccountService } from './services';

@Module({
	imports: [forwardRef(() => AssetStockModule)],
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

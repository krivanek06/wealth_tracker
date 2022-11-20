import { forwardRef, Module } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { AssetManagerModule } from '../asset-manager';
import {
	InvestmentAccountCashChangeResolver,
	InvestmentAccountHoldingResolver,
	InvestmentAccountResolver,
	InvestmentAccountTransactionResolver,
} from './resolvers';
import {
	InvestmentAccountCashChangeService,
	InvestmentAccountHoldingService,
	InvestmentAccountRepositoryService,
	InvestmentAccountService,
	InvestmentAccountTransactionService,
} from './services';

@Module({
	imports: [forwardRef(() => AssetManagerModule)],
	providers: [
		PrismaService,
		InvestmentAccountService,
		InvestmentAccountResolver,
		InvestmentAccountHoldingService,
		InvestmentAccountHoldingResolver,
		InvestmentAccountCashChangeService,
		InvestmentAccountCashChangeResolver,
		InvestmentAccountRepositoryService,
		InvestmentAccountTransactionService,
		InvestmentAccountTransactionResolver,
	],
	exports: [InvestmentAccountResolver, InvestmentAccountHoldingResolver, InvestmentAccountCashChangeResolver],
})
export class InvestmentAccountModule {}

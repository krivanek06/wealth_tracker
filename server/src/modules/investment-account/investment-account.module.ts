import { forwardRef, Module } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { AssetManagerModule } from '../asset-manager';
import {
	InvestmentAccountCashChangeResolver,
	InvestmentAccountHoldingResolver,
	InvestmentAccountResolver,
} from './resolvers';
import {
	InvestmentAccountCashChangeService,
	InvestmentAccountHoldingService,
	InvestmentAccountRepositoryService,
	InvestmentAccountService,
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
	],
	exports: [InvestmentAccountResolver, InvestmentAccountHoldingResolver, InvestmentAccountCashChangeResolver],
})
export class InvestmentAccountModule {}

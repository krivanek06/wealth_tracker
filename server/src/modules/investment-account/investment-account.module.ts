import { forwardRef, Module } from '@nestjs/common';
import { GraphQLPubsubBackendModule } from '../../graphql/pubsub.module';
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
	imports: [forwardRef(() => AssetManagerModule), GraphQLPubsubBackendModule],
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
	exports: [
		InvestmentAccountResolver,
		InvestmentAccountHoldingResolver,
		InvestmentAccountCashChangeResolver,
		InvestmentAccountService,
		InvestmentAccountHoldingService,
	],
})
export class InvestmentAccountModule {}

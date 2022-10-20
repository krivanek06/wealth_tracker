import { forwardRef, Module } from '@nestjs/common';
import { FinancialModelingAPIModule } from '../../api';
import { PrismaService } from './../../prisma';
import { AssetStockResolver } from './resolvers';
import { AssetStockService } from './services';

@Module({
	imports: [forwardRef(() => FinancialModelingAPIModule)],
	providers: [AssetStockResolver, AssetStockService, PrismaService],
	exports: [AssetStockResolver, AssetStockService],
})
export class AssetStockModule {}

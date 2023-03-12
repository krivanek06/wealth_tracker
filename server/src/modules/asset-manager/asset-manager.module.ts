import { forwardRef, Module } from '@nestjs/common';
import { FinancialModelingAPIModule } from '../../api';
import { PrismaService } from '../../prisma';
import { AssetGeneralResolver, AssetStockProfileResolver } from './resolvers';
import { AssetGeneralService, AssetStockService } from './services';

@Module({
	imports: [forwardRef(() => FinancialModelingAPIModule)],
	providers: [AssetGeneralResolver, AssetStockService, AssetGeneralService, AssetStockProfileResolver, PrismaService],
	exports: [AssetGeneralResolver, AssetStockService, AssetGeneralService, AssetStockProfileResolver],
})
export class AssetManagerModule {}

import { forwardRef, Module } from '@nestjs/common';
import { FinancialModelingAPIModule } from '../../api';
import { PrismaService } from '../../prisma';
import { AssetGeneralResolver } from './resolvers';
import { AssetGeneralService, AssetStockService } from './services';

@Module({
	imports: [forwardRef(() => FinancialModelingAPIModule)],
	providers: [AssetGeneralResolver, AssetStockService, AssetGeneralService, PrismaService],
	exports: [AssetGeneralResolver, AssetStockService, AssetGeneralService],
})
export class AssetManagerModule {}

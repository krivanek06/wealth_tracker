import { forwardRef, Module } from '@nestjs/common';
import { FinancialModelingAPIModule } from '../../api';
import { AssetStockResolver } from './resolvers';

@Module({
	imports: [forwardRef(() => FinancialModelingAPIModule)],
	providers: [AssetStockResolver],
	exports: [],
})
export class AssetStockModule {}

import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { FinancialModelingAPIService } from './financial-modeling-api.service';

@Module({
	imports: [HttpModule],
	providers: [FinancialModelingAPIService],
	exports: [FinancialModelingAPIService],
})
export class FinancialModelingAPIModule {}

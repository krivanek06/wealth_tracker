import { Module } from '@nestjs/common';
import { InvestmentAccountHistoryResolver } from './investment-account-history.resolver';
import { InvestmentAccountHistoryService } from './investment-account-history.service';

@Module({
	providers: [InvestmentAccountHistoryService, InvestmentAccountHistoryResolver],
	exports: [InvestmentAccountHistoryService, InvestmentAccountHistoryResolver],
})
export class InvestmentAccountHistoryModule {}

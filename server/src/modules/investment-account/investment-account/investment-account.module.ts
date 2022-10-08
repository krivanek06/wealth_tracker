import { Module } from '@nestjs/common';
import { InvestmentAccountResolver } from './investment-account.resolver';
import { InvestmentAccountService } from './investment-account.service';

@Module({
	providers: [InvestmentAccountService, InvestmentAccountResolver],
	exports: [InvestmentAccountService, InvestmentAccountResolver],
})
export class InvestmentAccountModule {}

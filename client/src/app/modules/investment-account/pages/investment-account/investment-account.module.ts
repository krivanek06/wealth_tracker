import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { InvestmentAccountActiveHoldingsModule } from '../../components';
import { InvestmentAccountComponent } from './investment-account.component';

@NgModule({
	declarations: [InvestmentAccountComponent],
	imports: [CommonModule, InvestmentAccountActiveHoldingsModule],
	exports: [InvestmentAccountComponent],
})
export class InvestmentAccountModule {}

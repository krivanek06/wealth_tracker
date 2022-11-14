import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { InvestmentAccountActiveHoldingsTableModule } from '../../components';
import { InvestmentAccountComponent } from './investment-account.component';

@NgModule({
	declarations: [InvestmentAccountComponent],
	imports: [CommonModule, InvestmentAccountActiveHoldingsTableModule],
	exports: [InvestmentAccountComponent],
})
export class InvestmentAccountModule {}

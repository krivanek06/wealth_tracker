import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PerceptageIncreaseDirective } from '../../../../shared/directives';
import { InvestmentAccountPeriodChangeComponent } from './investment-account-period-change.component';

@NgModule({
	declarations: [InvestmentAccountPeriodChangeComponent],
	imports: [CommonModule, PerceptageIncreaseDirective],
	exports: [InvestmentAccountPeriodChangeComponent],
})
export class InvestmentAccountPeriodChangeModule {}

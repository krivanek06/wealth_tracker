import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PerceptageIncreaseDirective } from './../../../../shared/directives';
import { InvestmentAccountStateComponent } from './investment-account-state.component';

@NgModule({
	declarations: [InvestmentAccountStateComponent],
	imports: [CommonModule, MatButtonModule, MatIconModule, PerceptageIncreaseDirective],
	exports: [InvestmentAccountStateComponent],
})
export class InvestmentAccountStateModule {}

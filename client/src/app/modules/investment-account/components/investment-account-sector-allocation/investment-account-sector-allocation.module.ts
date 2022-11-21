import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { InvestmentAccountSectorAllocationComponent } from './investment-account-sector-allocation.component';

@NgModule({
	declarations: [InvestmentAccountSectorAllocationComponent],
	imports: [CommonModule, MatButtonModule],
	exports: [InvestmentAccountSectorAllocationComponent],
})
export class InvestmentAccountSectorAllocationModule {}

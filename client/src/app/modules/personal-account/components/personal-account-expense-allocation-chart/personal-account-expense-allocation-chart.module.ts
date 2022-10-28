import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { PersonalAccountExpenseAllocationChartComponent } from './personal-account-expense-allocation-chart.component';

@NgModule({
	declarations: [PersonalAccountExpenseAllocationChartComponent],
	imports: [CommonModule, NgxChartsModule],
	exports: [PersonalAccountExpenseAllocationChartComponent],
})
export class PersonalAccountExpenseAllocationChartModule {}

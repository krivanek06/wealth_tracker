import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { PersonalAccountExpenseChartComponent } from './personal-account-expense-chart.component';

@NgModule({
	declarations: [PersonalAccountExpenseChartComponent],
	imports: [CommonModule, NgxChartsModule],
	exports: [PersonalAccountExpenseChartComponent],
})
export class PersonalAccountExpenseChartModule {}

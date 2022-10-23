import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PersonalAccountExpenseChartComponent } from './personal-account-expense-chart.component';

@NgModule({
	declarations: [PersonalAccountExpenseChartComponent],
	imports: [CommonModule],
	exports: [PersonalAccountExpenseChartComponent],
})
export class PersonalAccountExpenseChartModule {}

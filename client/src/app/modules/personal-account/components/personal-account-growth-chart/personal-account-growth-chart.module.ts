import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PersonalAccountGrowthChartComponent } from './personal-account-growth-chart.component';

@NgModule({
	declarations: [PersonalAccountGrowthChartComponent],
	imports: [CommonModule],
	exports: [PersonalAccountGrowthChartComponent],
})
export class PersonalAccountGrowthChartModule {}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { PersonalAccountGrowthChartComponent } from './personal-account-growth-chart.component';

@NgModule({
	declarations: [PersonalAccountGrowthChartComponent],
	imports: [CommonModule, NgxChartsModule],
	exports: [PersonalAccountGrowthChartComponent],
})
export class PersonalAccountGrowthChartModule {}

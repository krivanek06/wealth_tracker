import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HighchartsChartModule } from 'highcharts-angular';
import { PersonalAccountOverviewChartComponent } from './personal-account-overview-chart.component';

@NgModule({
	declarations: [PersonalAccountOverviewChartComponent],
	imports: [CommonModule, HighchartsChartModule],
	exports: [PersonalAccountOverviewChartComponent],
})
export class PersonalAccountOverviewChartModule {}

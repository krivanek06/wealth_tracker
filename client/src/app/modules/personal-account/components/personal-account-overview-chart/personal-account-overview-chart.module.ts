import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { PersonalAccountOverviewChartComponent } from './personal-account-overview-chart.component';

@NgModule({
	declarations: [PersonalAccountOverviewChartComponent],
	imports: [CommonModule, NgxChartsModule],
	exports: [PersonalAccountOverviewChartComponent],
})
export class PersonalAccountOverviewChartModule {}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HighchartsChartModule } from 'highcharts-angular';
import { GenericChartComponent } from './generic-chart.component';

@NgModule({
	declarations: [GenericChartComponent],
	imports: [CommonModule, HighchartsChartModule, MatButtonModule, MatIconModule, MatTooltipModule],
	exports: [GenericChartComponent],
})
export class GenericChartModule {}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { ProgressItemComponent } from '../../../../shared/components';
import {
	DefaultImgDirective,
	PerceptageIncreaseDirective,
	StylePaginatorDirective,
} from '../../../../shared/directives';
import { LargeNumberFormatterPipe } from '../../../../shared/pipes';
import { InvestmentAccountActiveHoldingsTableComponent } from './investment-account-active-holdings-table.component';

@NgModule({
	declarations: [InvestmentAccountActiveHoldingsTableComponent],
	imports: [
		CommonModule,
		MatTableModule,
		MatRippleModule,
		MatSortModule,
		MatPaginatorModule,
		StylePaginatorDirective,
		MatIconModule,
		MatButtonModule,
		DefaultImgDirective,
		LargeNumberFormatterPipe,
		ProgressItemComponent,
		PerceptageIncreaseDirective,
	],
	exports: [InvestmentAccountActiveHoldingsTableComponent],
})
export class InvestmentAccountActiveHoldingsTableModule {}

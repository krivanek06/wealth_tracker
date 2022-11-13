import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { ProgressItemModule } from '../../../../shared/components';
import { LargeNumberFormatterPipe } from '../../../../shared/pipes';
import {
	DefaultImgDirective,
	PerceptageIncreaseDirective,
	StylePaginatorDirective,
} from './../../../../shared/directives';
import { InvestmentAccountActiveHoldingsComponent } from './investment-account-active-holdings.component';

@NgModule({
	declarations: [InvestmentAccountActiveHoldingsComponent],
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
		ProgressItemModule,
		PerceptageIncreaseDirective,
	],
	exports: [InvestmentAccountActiveHoldingsComponent],
})
export class InvestmentAccountActiveHoldingsModule {}

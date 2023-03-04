import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DefaultImgDirective, StylePaginatorDirective } from './../../../../shared/directives';
import { PersonalAccountDailyEntriesTableComponent } from './personal-account-daily-entries-table.component';

@NgModule({
	declarations: [PersonalAccountDailyEntriesTableComponent],
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
		MatTooltipModule,
	],
	exports: [PersonalAccountDailyEntriesTableComponent],
})
export class PersonalAccountDailyEntriesTableModule {}

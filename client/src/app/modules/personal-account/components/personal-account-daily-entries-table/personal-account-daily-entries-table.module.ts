import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { PersonalAccountDailyEntriesTableComponent } from './personal-account-daily-entries-table.component';

@NgModule({
	declarations: [PersonalAccountDailyEntriesTableComponent],
	imports: [CommonModule, MatTableModule, MatRippleModule, MatSortModule],
	exports: [PersonalAccountDailyEntriesTableComponent],
})
export class PersonalAccountDailyEntriesTableModule {}

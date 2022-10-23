import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PersonalAccountDailyEntriesTableComponent } from './personal-account-daily-entries-table.component';

@NgModule({
	declarations: [PersonalAccountDailyEntriesTableComponent],
	imports: [CommonModule],
	exports: [PersonalAccountDailyEntriesTableComponent],
})
export class PersonalAccountDailyEntriesTableModule {}

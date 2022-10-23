import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PersonalAccountDailyEntriesFilterComponent } from './personal-account-daily-entries-filter.component';

@NgModule({
	declarations: [PersonalAccountDailyEntriesFilterComponent],
	imports: [CommonModule],
	exports: [PersonalAccountDailyEntriesFilterComponent],
})
export class PersonalAccountDailyEntriesFilterModule {}

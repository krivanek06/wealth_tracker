import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
	PersonalAccountDailyEntriesFilterModule,
	PersonalAccountDailyEntriesTableModule,
	PersonalAccountExpenseAllocationChartModule,
} from '../../components';
import { PersonalAccountDailyDataContainerComponent } from './personal-account-daily-data-container.component';

@NgModule({
	declarations: [PersonalAccountDailyDataContainerComponent],
	imports: [
		CommonModule,
		PersonalAccountDailyEntriesFilterModule,
		PersonalAccountDailyEntriesTableModule,
		PersonalAccountExpenseAllocationChartModule,
	],
	exports: [PersonalAccountDailyDataContainerComponent],
})
export class PersonalAccountDailyDataContainerModule {}

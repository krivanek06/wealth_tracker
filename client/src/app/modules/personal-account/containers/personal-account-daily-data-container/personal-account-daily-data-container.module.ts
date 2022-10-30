import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PersonalAccountDailyEntriesFilterModule, PersonalAccountDailyEntriesTableModule } from '../../components';
import { GenericChartModule } from './../../../../shared/components';
import { PersonalAccountDailyDataContainerComponent } from './personal-account-daily-data-container.component';

@NgModule({
	declarations: [PersonalAccountDailyDataContainerComponent],
	imports: [
		CommonModule,
		PersonalAccountDailyEntriesFilterModule,
		PersonalAccountDailyEntriesTableModule,
		GenericChartModule,
	],
	exports: [PersonalAccountDailyDataContainerComponent],
})
export class PersonalAccountDailyDataContainerModule {}

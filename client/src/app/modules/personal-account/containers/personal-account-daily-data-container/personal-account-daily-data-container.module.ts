import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PersonalAccountDailyEntriesFilterModule, PersonalAccountDailyEntriesTableModule } from '../../components';
import { PersonalAccountDailyDataEntryModule } from '../../modals';
import { GenericChartModule } from './../../../../shared/components';
import { PersonalAccountDailyDataContainerComponent } from './personal-account-daily-data-container.component';

@NgModule({
	declarations: [PersonalAccountDailyDataContainerComponent],
	imports: [
		CommonModule,
		PersonalAccountDailyEntriesFilterModule,
		PersonalAccountDailyEntriesTableModule,
		GenericChartModule,
		MatButtonModule,
		MatIconModule,
		ReactiveFormsModule,
		PersonalAccountDailyDataEntryModule,
	],
	exports: [PersonalAccountDailyDataContainerComponent],
})
export class PersonalAccountDailyDataContainerModule {}

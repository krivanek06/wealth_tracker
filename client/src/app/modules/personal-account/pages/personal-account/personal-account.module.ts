import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
	PersonalAccountAggregationRadioButtonsModule,
	PersonalAccountExpenseChartModule,
	PersonalAccountOverviewChartModule,
} from '../../components';
import { PersonalAccountDailyDataContainerModule } from '../../containers';
import { GenericChartModule } from './../../../../shared/components';
import { PersonalAccountComponent } from './personal-account.component';

@NgModule({
	declarations: [PersonalAccountComponent],
	imports: [
		CommonModule,
		PersonalAccountExpenseChartModule,
		PersonalAccountOverviewChartModule,
		PersonalAccountDailyDataContainerModule,
		PersonalAccountAggregationRadioButtonsModule,
		GenericChartModule,
	],
	exports: [PersonalAccountComponent],
})
export class PersonalAccountModule {}

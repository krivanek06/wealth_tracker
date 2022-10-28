import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
	PersonalAccountAggregationRadioButtonsModule,
	PersonalAccountExpenseChartModule,
	PersonalAccountGrowthChartModule,
	PersonalAccountOverviewChartModule,
} from '../../components';
import { PersonalAccountDailyDataContainerModule } from '../../containers';
import { PersonalAccountComponent } from './personal-account.component';

@NgModule({
	declarations: [PersonalAccountComponent],
	imports: [
		CommonModule,
		PersonalAccountExpenseChartModule,
		PersonalAccountGrowthChartModule,
		PersonalAccountOverviewChartModule,
		PersonalAccountDailyDataContainerModule,
		PersonalAccountAggregationRadioButtonsModule,
	],
	exports: [PersonalAccountComponent],
})
export class PersonalAccountModule {}

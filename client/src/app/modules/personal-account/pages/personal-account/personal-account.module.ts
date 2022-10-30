import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PersonalAccountAggregationRadioButtonsModule, PersonalAccountOverviewChartModule } from '../../components';
import { PersonalAccountDailyDataContainerModule } from '../../containers';
import { GenericChartModule } from './../../../../shared/components';
import { PersonalAccountComponent } from './personal-account.component';

@NgModule({
	declarations: [PersonalAccountComponent],
	imports: [
		CommonModule,
		PersonalAccountOverviewChartModule,
		PersonalAccountDailyDataContainerModule,
		PersonalAccountAggregationRadioButtonsModule,
		GenericChartModule,
	],
	exports: [PersonalAccountComponent],
})
export class PersonalAccountModule {}

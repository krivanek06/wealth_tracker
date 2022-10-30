import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
	PersonalAccountAggregationRadioButtonsModule,
	PersonalAccountOverviewChartModule,
	ValuePresentationItemModule,
} from '../../components';
import { PersonalAccountDailyDataContainerModule } from '../../containers';
import { GenericChartModule, MatCardWrapperModule } from './../../../../shared/components';
import { PersonalAccountComponent } from './personal-account.component';

@NgModule({
	declarations: [PersonalAccountComponent],
	imports: [
		CommonModule,
		PersonalAccountOverviewChartModule,
		PersonalAccountDailyDataContainerModule,
		PersonalAccountAggregationRadioButtonsModule,
		GenericChartModule,
		ValuePresentationItemModule,
		MatCardWrapperModule,
	],
	exports: [PersonalAccountComponent],
})
export class PersonalAccountModule {}

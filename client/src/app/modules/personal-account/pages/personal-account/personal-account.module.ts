import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PersonalAccountAggregationRadioButtonsModule, ValuePresentationItemModule } from '../../components';
import { PersonalAccountDailyDataContainerModule } from '../../containers';
import { GenericChartModule, ScrollWrapperModule } from './../../../../shared/components';
import { PersonalAccountComponent } from './personal-account.component';

@NgModule({
	declarations: [PersonalAccountComponent],
	imports: [
		CommonModule,
		PersonalAccountDailyDataContainerModule,
		PersonalAccountAggregationRadioButtonsModule,
		GenericChartModule,
		ValuePresentationItemModule,
		ScrollWrapperModule,
	],
	exports: [PersonalAccountComponent],
})
export class PersonalAccountModule {}

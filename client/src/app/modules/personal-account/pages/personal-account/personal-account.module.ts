import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { PersonalAccountOverviewChartModule, ValuePresentationItemModule } from '../../components';
import { PersonalAccountDailyDataContainerModule } from '../../containers';
import { GenericChartModule, ScrollWrapperModule } from './../../../../shared/components';
import { PersonalAccountComponent } from './personal-account.component';

@NgModule({
	declarations: [PersonalAccountComponent],
	imports: [
		CommonModule,
		PersonalAccountDailyDataContainerModule,
		GenericChartModule,
		ValuePresentationItemModule,
		ScrollWrapperModule,
		PersonalAccountOverviewChartModule,
		ReactiveFormsModule,
	],
	exports: [PersonalAccountComponent],
})
export class PersonalAccountModule {}

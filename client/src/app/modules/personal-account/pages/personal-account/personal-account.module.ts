import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PersonalAccountOverviewModule } from '../../components';
import { PersonalAccountComponent } from './personal-account.component';

@NgModule({
	declarations: [PersonalAccountComponent],
	imports: [CommonModule, PersonalAccountOverviewModule],
	exports: [PersonalAccountComponent],
})
export class PersonalAccountModule {}

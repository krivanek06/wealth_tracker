import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { PersonalAccountOverviewComponent } from './personal-account-overview.component';

@NgModule({
	declarations: [PersonalAccountOverviewComponent],
	imports: [CommonModule, MatDividerModule],
	exports: [PersonalAccountOverviewComponent],
})
export class PersonalAccountOverviewModule {}

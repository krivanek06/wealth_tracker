import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { PersonalAccountDailyEntryPipe } from '../../pipes';
import { PersonalAccountDailyEntriesFilterComponent } from './personal-account-daily-entries-filter.component';

@NgModule({
	declarations: [PersonalAccountDailyEntriesFilterComponent],
	imports: [
		CommonModule,
		MatFormFieldModule,
		MatSelectModule,
		MatButtonModule,
		ReactiveFormsModule,
		PersonalAccountDailyEntryPipe,
	],
	exports: [PersonalAccountDailyEntriesFilterComponent],
})
export class PersonalAccountDailyEntriesFilterModule {}

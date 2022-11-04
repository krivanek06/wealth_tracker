import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatTimepickerModule } from 'mat-timepicker';
import { SelectTagFormFieldModule } from '../../components/form-fields';
import { DefaultImgDirective } from './../../../../shared/directives';
import { DailyDataEntryDisplayElementsComponent } from './daily-data-entry-display-elements/daily-data-entry-display-elements.component';
import { PersonalAccountDailyDataEntryComponent } from './personal-account-daily-data-entry.component';

@NgModule({
	declarations: [PersonalAccountDailyDataEntryComponent, DailyDataEntryDisplayElementsComponent],
	imports: [
		CommonModule,
		MatDialogModule,
		MatButtonModule,
		ReactiveFormsModule,
		MatFormFieldModule,
		MatInputModule,
		MatIconModule,
		SelectTagFormFieldModule,
		MatDividerModule,
		MatTimepickerModule,
		MatDatepickerModule,
		DefaultImgDirective,
		MatRadioModule,
	],
})
export class PersonalAccountDailyDataEntryModule {}

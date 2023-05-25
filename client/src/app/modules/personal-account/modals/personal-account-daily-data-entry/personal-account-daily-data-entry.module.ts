import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
	DatePickerComponent,
	DialogCloseHeaderComponent,
	FormMatInputWrapperModule,
	NumberKeyboardComponent,
} from '../../../../shared/components';
import { NotificationBarModule } from './../../../../shared/dialogs';
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
		MatInputModule,
		MatIconModule,
		MatDividerModule,
		DefaultImgDirective,
		NumberKeyboardComponent,
		FormMatInputWrapperModule,
		DatePickerComponent,
		MatTooltipModule,
		NotificationBarModule,
		DialogCloseHeaderComponent,
	],
})
export class PersonalAccountDailyDataEntryModule {}

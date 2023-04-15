import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormMatInputWrapperComponent } from './form-mat-input-wrapper.component';
@NgModule({
	declarations: [FormMatInputWrapperComponent],
	imports: [
		CommonModule,
		ReactiveFormsModule,
		MatCheckboxModule,
		MatSlideToggleModule,
		MatRadioModule,
		MatSelectModule,
		MatTooltipModule,
		MatIconModule,
		MatInputModule,
		MatFormFieldModule,
		MatAutocompleteModule,
		FormsModule,
		MatSliderModule,
		MatButtonModule,
	],
	exports: [FormMatInputWrapperComponent],
})
export class FormMatInputWrapperModule {}

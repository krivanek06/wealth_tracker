import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { DefaultImgDirective } from './../../../../../shared/directives';
import { SelectTagFormFieldComponent } from './select-tag-form-field.component';

@NgModule({
	declarations: [SelectTagFormFieldComponent],
	imports: [CommonModule, MatFormFieldModule, ReactiveFormsModule, MatSelectModule, DefaultImgDirective],
	exports: [SelectTagFormFieldComponent],
})
export class SelectTagFormFieldModule {}

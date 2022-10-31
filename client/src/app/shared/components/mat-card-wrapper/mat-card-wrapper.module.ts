import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardWrapperComponent } from './mat-card-wrapper.component';

@NgModule({
	declarations: [MatCardWrapperComponent],
	imports: [CommonModule, MatCardModule, MatDividerModule],
	exports: [MatCardWrapperComponent],
})
export class MatCardWrapperModule {}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ProgressItemComponent } from './progress-item.component';

@NgModule({
	declarations: [ProgressItemComponent],
	imports: [CommonModule],
	exports: [ProgressItemComponent],
})
export class ProgressItemModule {}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ScrollWrapperComponent } from './scroll-wrapper.component';

@NgModule({
	declarations: [ScrollWrapperComponent],
	imports: [CommonModule, MatButtonModule, MatIconModule],
	exports: [ScrollWrapperComponent],
})
export class ScrollWrapperModule {}

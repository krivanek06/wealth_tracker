import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ValuePresentationItemComponent } from './value-presentation-item.component';

@NgModule({
	declarations: [ValuePresentationItemComponent],
	imports: [CommonModule, MatButtonModule],
	exports: [ValuePresentationItemComponent],
})
export class ValuePresentationItemModule {}

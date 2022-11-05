import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { DefaultImgDirective } from './../../../../shared/directives';
import { ValuePresentationItemComponent } from './value-presentation-item.component';

@NgModule({
	declarations: [ValuePresentationItemComponent],
	imports: [CommonModule, MatButtonModule, DefaultImgDirective],
	exports: [ValuePresentationItemComponent],
})
export class ValuePresentationItemModule {}

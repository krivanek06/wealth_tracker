import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { DefaultImgDirective } from '../../directives';
import { InArrayPipe } from '../../pipes';
import { ValuePresentationItemComponent } from './value-presentation-item.component';

@NgModule({
	declarations: [ValuePresentationItemComponent],
	imports: [CommonModule, MatButtonModule, DefaultImgDirective, InArrayPipe],
	exports: [ValuePresentationItemComponent],
})
export class ValuePresentationItemModule {}

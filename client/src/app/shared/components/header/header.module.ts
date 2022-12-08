import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HeaderComponent } from './header.component';

import { MatChipsModule } from '@angular/material/chips';

@NgModule({
	declarations: [HeaderComponent],
	imports: [CommonModule, MatChipsModule, MatButtonModule, MatIconModule],
	exports: [HeaderComponent],
})
export class HeaderModule {}

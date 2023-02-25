import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ColorPickerComponent, FormMatInputWrapperModule, SliderComponent } from '../../../../shared/components';
import { DefaultImgDirective, TooltipDirective } from '../../../../shared/directives';
import { MainInfoComponent } from './main-info/main-info.component';
import { PersonalAccountTagManagerModalComponent } from './personal-account-tag-manager-modal.component';
import { TagItemComponent } from './tag-item/tag-item.component';
import { TagSelectorComponent } from './tag-selector/tag-selector.component';

@NgModule({
	declarations: [PersonalAccountTagManagerModalComponent, TagItemComponent, MainInfoComponent, TagSelectorComponent],
	imports: [
		CommonModule,
		MatDialogModule,
		MatButtonModule,
		ReactiveFormsModule,
		MatInputModule,
		MatIconModule,
		MatDividerModule,
		FormMatInputWrapperModule,
		TooltipDirective,
		MatCheckboxModule,
		ColorPickerComponent,
		DefaultImgDirective,
		SliderComponent,
	],
})
export class PersonalAccountTagManagerModalModule {}

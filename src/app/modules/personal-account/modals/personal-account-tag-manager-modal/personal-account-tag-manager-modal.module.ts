import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
	ColorPickerComponent,
	DialogCloseHeaderComponent,
	FormMatInputWrapperComponent,
	SliderComponent,
} from '../../../../shared/components';
import { DefaultImgDirective, RangeDirective } from '../../../../shared/directives';
import { TagTypeNameDirective } from '../../directives';
import { PersonalAccountTagManagerModalComponent } from './personal-account-tag-manager-modal.component';
import { TagImageSelectorComponent } from './tag-image-selector/tag-image-selector.component';
import { TagItemComponent } from './tag-item/tag-item.component';

@NgModule({
	declarations: [PersonalAccountTagManagerModalComponent, TagItemComponent, TagImageSelectorComponent],
	imports: [
		CommonModule,
		MatDialogModule,
		MatButtonModule,
		ReactiveFormsModule,
		MatInputModule,
		MatIconModule,
		MatDividerModule,
		MatCheckboxModule,
		ColorPickerComponent,
		DefaultImgDirective,
		SliderComponent,
		TagTypeNameDirective,
		MatTooltipModule,
		RangeDirective,
		DialogCloseHeaderComponent,
		FormMatInputWrapperComponent,
	],
})
export class PersonalAccountTagManagerModalModule {}

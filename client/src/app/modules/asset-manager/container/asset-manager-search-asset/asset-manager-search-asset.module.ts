import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { DefaultImgDirective } from '../../../../shared/directives';
import { AssetManagerSearchAssetComponent } from './asset-manager-search-asset.component';

@NgModule({
	declarations: [AssetManagerSearchAssetComponent],
	imports: [
		CommonModule,
		ReactiveFormsModule,
		MatSelectModule,
		MatInputModule,
		MatFormFieldModule,
		MatAutocompleteModule,
		DefaultImgDirective,
		MatProgressSpinnerModule,
	],
	exports: [AssetManagerSearchAssetComponent],
})
export class AssetManagerSearchAssetModule {}

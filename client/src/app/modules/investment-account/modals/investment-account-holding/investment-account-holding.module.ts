import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { FormMatInputWrapperModule } from '../../../../shared/components';
import { NotificationBarModule } from '../../../../shared/dialogs';
import { DefaultImgDirective } from '../../../../shared/directives';
import { LargeNumberFormatterPipe, SortByKeyPipe } from '../../../../shared/pipes';
import { AssetManagerSearchAssetModule } from '../../../asset-manager';
import { InvestmentAccountHoldingComponent } from './investment-account-holding.component';

@NgModule({
	declarations: [InvestmentAccountHoldingComponent],
	imports: [
		CommonModule,
		MatDialogModule,
		MatButtonModule,
		ReactiveFormsModule,
		MatIconModule,
		MatDividerModule,
		DefaultImgDirective,
		FormMatInputWrapperModule,
		LargeNumberFormatterPipe,
		NotificationBarModule,
		SortByKeyPipe,
		MatRadioModule,
		AssetManagerSearchAssetModule,
	],
})
export class InvestmentAccountHoldingModule {}

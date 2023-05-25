import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
	DatePickerComponent,
	DialogCloseHeaderComponent,
	FormMatInputWrapperModule,
	GenericChartModule,
	NumberKeyboardComponent,
} from '../../../../shared/components';
import { NotificationBarModule } from '../../../../shared/dialogs';
import { DefaultImgDirective, PerceptageIncreaseDirective } from '../../../../shared/directives';
import { LargeNumberFormatterPipe, SortByKeyPipe } from '../../../../shared/pipes';
import { AssetManagerSearchAssetModule } from '../../../asset-manager';
import { HoldingHistoryItemComponent } from './holding-history-item/holding-history-item.component';
import { InvestmentAccountHoldingComponent } from './investment-account-holding.component';
import { RecordStateComponent } from './record-state/record-state.component';

@NgModule({
	declarations: [InvestmentAccountHoldingComponent, HoldingHistoryItemComponent, RecordStateComponent],
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
		MatTooltipModule,
		PerceptageIncreaseDirective,
		DatePickerComponent,
		NumberKeyboardComponent,
		GenericChartModule,
		MatCheckboxModule,
		DialogCloseHeaderComponent,
	],
})
export class InvestmentAccountHoldingModule {}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { FormMatInputWrapperModule } from 'src/app/shared/components';
import { DefaultImgDirective } from 'src/app/shared/directives';
import { NotificationBarModule } from '../../../../shared/dialogs';
import { LargeNumberFormatterPipe, SortByKeyPipe } from '../../../../shared/pipes';
import { InvestmentAccountCashChangeItemComponent } from './investment-account-cash-change-item/investment-account-cash-change-item.component';
import { InvestmentAccountCashChangeComponent } from './investment-account-cash-change.component';

@NgModule({
	declarations: [InvestmentAccountCashChangeComponent, InvestmentAccountCashChangeItemComponent],
	imports: [
		CommonModule,
		MatDialogModule,
		MatButtonModule,
		ReactiveFormsModule,
		MatIconModule,
		MatDividerModule,
		DefaultImgDirective,
		MatDatepickerModule,
		FormMatInputWrapperModule,
		LargeNumberFormatterPipe,
		NotificationBarModule,
		SortByKeyPipe,
	],
})
export class InvestmentAccountCashChangeModule {}

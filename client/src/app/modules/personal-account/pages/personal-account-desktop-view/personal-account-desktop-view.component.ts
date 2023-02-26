import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
	FormMatInputWrapperModule,
	GenericChartModule,
	ScrollWrapperModule,
	ValuePresentationButtonControlComponent,
} from '../../../../shared/components';
import { PersonalAccountParent } from '../../classes';
import {
	PersonalAccountAccountGrowthChartComponent,
	PersonalAccountAccountStateComponent,
	PersonalAccountActionButtonsComponent,
	PersonalAccountDailyEntriesFilterComponent,
	PersonalAccountDailyEntriesTableModule,
	PersonalAccountTagAllocationChartComponent,
	PersonalAccountTagSpendingChartComponent,
} from '../../components';
import { PersonalAccountDailyDataEntryModule } from '../../modals';
import { PersonalAccountTagManagerModalComponent } from '../../modals/personal-account-tag-manager-modal/personal-account-tag-manager-modal.component';
import { PersonalAccountActionButtonType } from '../../models';
import { PersonalAccountTagManagerModalModule } from './../../modals/personal-account-tag-manager-modal/personal-account-tag-manager-modal.module';

@Component({
	selector: 'app-personal-account-desktop-view',
	standalone: true,
	imports: [
		CommonModule,
		GenericChartModule,
		ValuePresentationButtonControlComponent,
		ScrollWrapperModule,
		PersonalAccountTagSpendingChartComponent,
		ReactiveFormsModule,
		PersonalAccountDailyEntriesTableModule,
		MatButtonModule,
		MatIconModule,
		PersonalAccountDailyDataEntryModule,
		FormMatInputWrapperModule,
		PersonalAccountDailyEntriesFilterComponent,
		PersonalAccountAccountStateComponent,
		PersonalAccountTagAllocationChartComponent,
		PersonalAccountAccountGrowthChartComponent,
		PersonalAccountActionButtonsComponent,
		PersonalAccountTagManagerModalModule,
	],
	templateUrl: './personal-account-desktop-view.component.html',
	styleUrls: ['./personal-account-desktop-view.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonalAccountDesktopViewComponent extends PersonalAccountParent implements OnInit {
	constructor() {
		super();
	}

	ngOnInit(): void {
		this.accountOverviewChartData$.subscribe((x) => console.log('ttt', x));
	}

	onActionButtonClick(type: PersonalAccountActionButtonType): void {
		this.dialog.open(PersonalAccountTagManagerModalComponent, {
			data: {
				personalAccountId: this.personalAccountBasic.id,
				personalAccountName: this.personalAccountBasic.name,
			},
			panelClass: ['g-mat-dialog-big'],
		});
	}
}

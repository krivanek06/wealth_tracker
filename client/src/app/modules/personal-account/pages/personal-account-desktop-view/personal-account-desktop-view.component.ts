import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
	FormMatInputWrapperModule,
	GenericChartModule,
	PieChartComponent,
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
	PersonalAccountExpensesByTagComponent,
	PersonalAccountTagSpendingChartComponent,
} from '../../components';
import { PersonalAccountDailyDataEntryModule } from '../../modals';
import { DateFormatterPipe } from '../../pipes';
import { PersonalAccountTagManagerModalModule } from './../../modals';
import { PersonalAccountDesktopViewSkeletonComponent } from './personal-account-desktop-view-skeleton/personal-account-desktop-view-skeleton.component';

@Component({
	selector: 'app-personal-account-desktop-view',
	standalone: true,
	imports: [
		CommonModule,
		GenericChartModule,
		PersonalAccountDesktopViewSkeletonComponent,
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
		PieChartComponent,
		PersonalAccountAccountGrowthChartComponent,
		PersonalAccountActionButtonsComponent,
		PersonalAccountTagManagerModalModule,
		PersonalAccountExpensesByTagComponent,
		DateFormatterPipe,
	],
	templateUrl: './personal-account-desktop-view.component.html',
	styleUrls: ['./personal-account-desktop-view.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonalAccountDesktopViewComponent extends PersonalAccountParent implements OnInit {
	constructor() {
		super();
	}

	ngOnInit(): void {}
}

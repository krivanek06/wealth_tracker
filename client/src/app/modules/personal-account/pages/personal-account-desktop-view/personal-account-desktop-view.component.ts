import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PersonalAccountParent } from '../../classes';
import {
	PersonalAccountDailyEntriesFilterComponent,
	PersonalAccountDailyEntriesTableModule,
	PersonalAccountOverviewChartModule,
} from '../../components';
import { PersonalAccountDailyDataEntryModule } from '../../modals';
import {
	FormMatInputWrapperModule,
	GenericChartModule,
	ScrollWrapperModule,
	ValuePresentationButtonControlComponent,
} from './../../../../shared/components';

@Component({
	selector: 'app-personal-account-desktop-view',
	standalone: true,
	imports: [
		CommonModule,
		GenericChartModule,
		ValuePresentationButtonControlComponent,
		ScrollWrapperModule,
		PersonalAccountOverviewChartModule,
		ReactiveFormsModule,
		PersonalAccountDailyEntriesTableModule,
		MatButtonModule,
		MatIconModule,
		PersonalAccountDailyDataEntryModule,
		FormMatInputWrapperModule,
		PersonalAccountDailyEntriesFilterComponent,
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

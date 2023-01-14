import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { PersonalAccountDailyDataOutputFragment } from '../../../../core/graphql';
import { PersonalAccountParent } from '../../classes';
import {
	PersonalAccountDailyEntriesFilterComponent,
	PersonalAccountDailyEntriesTableModule,
	PersonalAccountOverviewChartModule,
} from '../../components';
import { PersonalAccountDailyDataEntryComponent, PersonalAccountDailyDataEntryModule } from '../../modals';
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
	constructor(private dialog: MatDialog) {
		super();
	}

	ngOnInit(): void {
		console.log('ON INIT');

		this.accountOverviewChartData$.subscribe((x) => console.log('accountOverviewChartData$', x));
	}

	onDailyEntryClick(editingDailyData: PersonalAccountDailyDataOutputFragment | null): void {
		this.dialog.open(PersonalAccountDailyDataEntryComponent, {
			data: {
				dailyData: editingDailyData,
				personalAccountId: this.personalAccountBasic.id,
				personalAccountName: this.personalAccountBasic.name,
			},
			panelClass: ['g-mat-dialog-big'],
		});
	}
}

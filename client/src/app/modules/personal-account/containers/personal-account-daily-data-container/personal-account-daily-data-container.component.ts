import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Host, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { PersonalAccountDailyDataAggregator } from '../../classes';
import { PersonalAccountDailyEntriesFilterModule, PersonalAccountDailyEntriesTableModule } from '../../components';
import { PersonalAccountDailyDataEntryModule } from '../../modals';
import { PersonalAccountDailyDataOutputFragment } from './../../../../core/graphql';
import { GenericChartModule } from './../../../../shared/components';
import { PersonalAccountDailyDataEntryComponent } from './../../modals';

@Component({
	selector: 'app-personal-account-daily-data-container',
	templateUrl: './personal-account-daily-data-container.component.html',
	styleUrls: ['./personal-account-daily-data-container.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	hostDirectives: [
		{
			directive: PersonalAccountDailyDataAggregator,
			inputs: ['personalAccountBasic'],
		},
	],
	imports: [
		CommonModule,
		PersonalAccountDailyEntriesFilterModule,
		PersonalAccountDailyEntriesTableModule,
		GenericChartModule,
		MatButtonModule,
		MatIconModule,
		ReactiveFormsModule,
		PersonalAccountDailyDataEntryModule,
	],
})
export class PersonalAccountDailyDataContainerComponent implements OnInit {
	constructor(@Host() public dailyDataAggregator: PersonalAccountDailyDataAggregator, private dialog: MatDialog) {}

	ngOnInit(): void {}

	onDailyEntryClick(editingDailyData: PersonalAccountDailyDataOutputFragment | null): void {
		this.dialog.open(PersonalAccountDailyDataEntryComponent, {
			data: {
				dailyData: editingDailyData,
				personalAccountId: this.dailyDataAggregator.personalAccountBasic.id,
				personalAccountName: this.dailyDataAggregator.personalAccountBasic.name,
			},
			panelClass: ['g-mat-dialog-big'],
		});
	}
}

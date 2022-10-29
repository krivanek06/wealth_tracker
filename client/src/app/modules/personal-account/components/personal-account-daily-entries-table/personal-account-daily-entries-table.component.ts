import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { PersonalAccountDailyDataFragment } from './../../../../core/graphql';

@Component({
	selector: 'app-personal-account-daily-entries-table',
	templateUrl: './personal-account-daily-entries-table.component.html',
	styleUrls: ['./personal-account-daily-entries-table.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonalAccountDailyEntriesTableComponent implements OnInit {
	@Input() set personalAccountDailyData(data: PersonalAccountDailyDataFragment[] | undefined) {
		this.dataSource = new MatTableDataSource(data);
	}
	displayedColumns: string[] = ['tag', 'value', 'date', 'week', 'month'];
	dataSource!: MatTableDataSource<PersonalAccountDailyDataFragment>;

	constructor() {}

	ngOnInit(): void {}

	identify(index: number, item: PersonalAccountDailyDataFragment): string {
		return item.id;
	}
}

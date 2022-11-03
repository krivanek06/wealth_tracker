import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PersonalAccountDailyDataFragment } from './../../../../core/graphql';

@Component({
	selector: 'app-personal-account-daily-entries-table',
	templateUrl: './personal-account-daily-entries-table.component.html',
	styleUrls: ['./personal-account-daily-entries-table.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonalAccountDailyEntriesTableComponent implements OnInit {
	@Output() dailyEntryClickEmitter: EventEmitter<void> = new EventEmitter<void>();
	@ViewChild(MatPaginator) paginator!: MatPaginator;
	@ViewChild(MatSort) sort!: MatSort;

	@Input() set personalAccountDailyData(data: PersonalAccountDailyDataFragment[] | undefined) {
		this.dataSource = new MatTableDataSource(data);
		this.dataSource.paginator = this.paginator;
		this.dataSource.sort = this.sort;
	}
	displayedColumns: string[] = ['tag', 'value', 'date', 'week', 'month'];
	dataSource!: MatTableDataSource<PersonalAccountDailyDataFragment>;

	constructor() {}

	ngOnInit(): void {}

	identify(index: number, item: PersonalAccountDailyDataFragment): string {
		return item.id;
	}

	onDailyEntryClick(): void {
		this.dailyEntryClickEmitter.emit();
	}
}

import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PersonalAccountDailyDataOutputFragment, TagDataType } from './../../../../core/graphql';

@Component({
	selector: 'app-personal-account-daily-entries-table',
	templateUrl: './personal-account-daily-entries-table.component.html',
	styleUrls: ['./personal-account-daily-entries-table.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonalAccountDailyEntriesTableComponent implements OnInit {
	@Output() addDailyEntryClickEmitter = new EventEmitter<void>();
	@Output() editDailyEntryClickEmitter = new EventEmitter<PersonalAccountDailyDataOutputFragment>();

	@ViewChild(MatPaginator) paginator!: MatPaginator;
	@ViewChild(MatSort) sort!: MatSort;

	@Input() set personalAccountDailyData(data: PersonalAccountDailyDataOutputFragment[] | null) {
		const dataOrder = (data ?? []).slice().sort((a, b) => Number(b.date) - Number(a.date));
		this.dataSource = new MatTableDataSource(dataOrder);
		this.dataSource.paginator = this.paginator;
		this.dataSource.sort = this.sort;
	}
	displayedColumns: string[] = ['tag', 'value', 'date', 'week', 'month'];
	dataSource!: MatTableDataSource<PersonalAccountDailyDataOutputFragment>;

	TagDataType = TagDataType;

	constructor() {}

	ngOnInit(): void {}

	identity(index: number, item: PersonalAccountDailyDataOutputFragment): string {
		return item.id;
	}

	onEditDailyEntryClick(data: PersonalAccountDailyDataOutputFragment): void {
		this.editDailyEntryClickEmitter.emit(data);
	}

	onAddDailyEntryClick(): void {
		this.addDailyEntryClickEmitter.emit();
	}
}

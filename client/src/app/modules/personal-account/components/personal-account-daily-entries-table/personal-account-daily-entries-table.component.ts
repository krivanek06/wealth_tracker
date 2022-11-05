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
	@Output() addDailyEntryClickEmitter = new EventEmitter<void>();
	@Output() editDailyEntryClickEmitter = new EventEmitter<PersonalAccountDailyDataFragment>();

	@ViewChild(MatPaginator) paginator!: MatPaginator;
	@ViewChild(MatSort) sort!: MatSort;

	@Input() set personalAccountDailyData(data: PersonalAccountDailyDataFragment[] | undefined) {
		const dataOrder = (data ?? []).sort((a, b) => Number(b.date) - Number(a.date));
		this.dataSource = new MatTableDataSource(dataOrder);
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

	onEditDailyEntryClick(data: PersonalAccountDailyDataFragment): void {
		this.editDailyEntryClickEmitter.emit(data);
	}

	onAddDailyEntryClick(): void {
		this.addDailyEntryClickEmitter.emit();
	}
}

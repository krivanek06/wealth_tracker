import { CommonModule } from '@angular/common';
import {
	AfterViewInit,
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	Input,
	OnInit,
	Output,
	ViewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PersonalAccountDailyDataOutputFragment, TagDataType } from './../../../../core/graphql';
import { DefaultImgDirective, RangeDirective, StylePaginatorDirective } from './../../../../shared/directives';
@Component({
	selector: 'app-personal-account-daily-entries-table',
	templateUrl: './personal-account-daily-entries-table.component.html',
	styleUrls: ['./personal-account-daily-entries-table.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [
		CommonModule,
		MatTableModule,
		MatRippleModule,
		MatSortModule,
		MatPaginatorModule,
		StylePaginatorDirective,
		MatIconModule,
		MatButtonModule,
		DefaultImgDirective,
		MatTooltipModule,
		RangeDirective,
	],
})
export class PersonalAccountDailyEntriesTableComponent implements OnInit, AfterViewInit {
	@Output() editDailyEntryClickEmitter = new EventEmitter<PersonalAccountDailyDataOutputFragment>();

	@ViewChild(MatPaginator) paginator!: MatPaginator;
	@ViewChild(MatSort) sort!: MatSort;

	@Input() set personalAccountDailyData(data: PersonalAccountDailyDataOutputFragment[] | null) {
		const dataOrder = (data ?? []).slice().sort((a, b) => Number(b.date) - Number(a.date));
		this.dataSource = new MatTableDataSource(dataOrder);
		this.dataSource.paginator = this.paginator;
		this.dataSource.sort = this.sort;
	}
	displayedColumns: string[] = ['tag', 'value'];
	dataSource!: MatTableDataSource<PersonalAccountDailyDataOutputFragment>;

	TagDataType = TagDataType;

	constructor() {}

	ngOnInit(): void {}

	ngAfterViewInit(): void {
		if (this.dataSource) {
			this.dataSource.paginator = this.paginator;
		}
	}

	identity(index: number, item: PersonalAccountDailyDataOutputFragment): string {
		return item.id;
	}

	onEditDailyEntryClick(data: PersonalAccountDailyDataOutputFragment): void {
		this.editDailyEntryClickEmitter.emit(data);
	}
}

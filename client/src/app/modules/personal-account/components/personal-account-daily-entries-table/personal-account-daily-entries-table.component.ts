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
import { PersonalAccountDailyDataNew } from './../../../../core/api';
import { DefaultImgDirective, RangeDirective, StylePaginatorDirective } from './../../../../shared/directives';
@Component({
	selector: 'app-personal-account-daily-entries-table',
	template: `
		<table class="w-full" mat-table [dataSource]="dataSource" matSort [trackBy]="identity">
			<!-- tags -->
			<ng-container matColumnDef="tag">
				<th mat-header-cell *matHeaderCellDef>Tag</th>
				<td mat-cell *matCellDef="let row">
					<div class="flex items-center gap-3">
						<!-- tag svg -->
						<img appDefaultImg [src]="row.tag.imageUrl" class="h-9" />

						<!-- tag data -->
						<div class="flex flex-col">
							<div class="flex items-center gap-4">
								<div style="border-color: {{ row.tag.color }}" class="pr-2 text-base border-b-2 text-wt-gray-light">
									<span style="color: {{ row.tag.color }}">●</span>
									{{ row.tag.name }}
								</div>
								<!-- description -->
								<mat-icon *ngIf="row.description" [matTooltip]="row.description" class="text-wt-gray-medium">
									description
								</mat-icon>
							</div>

							<!-- date -->
							<div class="text-wt-gray-medium">
								<span>{{ row.date | date: 'MMMM d.' }}</span> | <span> {{ row.date | date: 'EEEE' }}</span> |
								<span>Week {{ row.week }}.</span>
							</div>
						</div>
					</div>
				</td>
			</ng-container>

			<!-- value -->
			<ng-container matColumnDef="value">
				<th mat-header-cell *matHeaderCellDef>Value</th>
				<td
					mat-cell
					*matCellDef="let row"
					class="text-lg"
					[ngClass]="{
						'text-wt-danger-medium': row.tag.type === 'EXPENSE',
						'text-wt-success-medium': row.tag.type === 'INCOME'
					}"
				>
					{{ row.value | currency }}
				</td>
			</ng-container>

			<tr mat-header-row *matHeaderRowDef="displayedColumns" class="hidden"></tr>
			<tr
				mat-row
				*matRowDef="let row; columns: displayedColumns"
				(click)="onEditDailyEntryClick(row)"
				class="h-[60px]"
			></tr>

			<!-- Row shown when there is no matching data. -->
			<tr class="mat-row" *matNoDataRow>
				<td class="mat-cell" colspan="3">No data has been found</td>
			</tr>
		</table>

		<!-- pagination -->
		<div *ngIf="dataSource?.filteredData" class="mt-2">
			<mat-paginator
				appStylePaginator
				showFirstLastButtons
				[length]="dataSource.filteredData.length"
				[appCustomLength]="dataSource.filteredData.length"
				[pageSize]="12"
			></mat-paginator>
		</div>
	`,
	styles: [
		`
			:host {
				display: block;

				.mat-column-value {
					min-width: 80px;
				}
			}
		`,
	],
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
	@Output() editDailyEntryClickEmitter = new EventEmitter<PersonalAccountDailyDataNew>();

	@ViewChild(MatPaginator) paginator!: MatPaginator;
	@ViewChild(MatSort) sort!: MatSort;

	@Input() set personalAccountDailyData(data: PersonalAccountDailyDataNew[] | null) {
		const dataOrder = (data ?? []).slice().sort((a, b) => Number(b.date) - Number(a.date));
		this.dataSource = new MatTableDataSource(dataOrder);
		this.dataSource.paginator = this.paginator;
		this.dataSource.sort = this.sort;
	}
	displayedColumns: string[] = ['tag', 'value'];
	dataSource!: MatTableDataSource<PersonalAccountDailyDataNew>;

	constructor() {}

	ngOnInit(): void {}

	ngAfterViewInit(): void {
		if (this.dataSource) {
			this.dataSource.paginator = this.paginator;
		}
	}

	identity(index: number, item: PersonalAccountDailyDataNew): string {
		return item.id;
	}

	onEditDailyEntryClick(data: PersonalAccountDailyDataNew): void {
		this.editDailyEntryClickEmitter.emit(data);
	}
}

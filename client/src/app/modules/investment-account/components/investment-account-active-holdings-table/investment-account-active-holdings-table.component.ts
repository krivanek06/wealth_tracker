import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	Input,
	OnInit,
	Output,
	TrackByFunction,
	ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {
	InvestmentAccountActiveHoldingOutput,
	InvestmentAccountActiveHoldingOutputFragment,
} from '../../../../core/graphql';

@Component({
	selector: 'app-investment-account-active-holdings-table',
	templateUrl: './investment-account-active-holdings-table.component.html',
	styleUrls: ['./investment-account-active-holdings-table.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvestmentAccountActiveHoldingsTableComponent implements OnInit {
	@Output() holdingClickedEmitter = new EventEmitter<InvestmentAccountActiveHoldingOutputFragment>();
	@Output() addEmitter = new EventEmitter<void>();
	@Output() showHistoryEmitter = new EventEmitter<void>();

	@ViewChild(MatPaginator) paginator!: MatPaginator;
	@ViewChild(MatSort) sort!: MatSort;

	@Input() set activeHoldings(activeHoldingsData: InvestmentAccountActiveHoldingOutputFragment[] | null) {
		this.dataSource = new MatTableDataSource(activeHoldingsData ?? []);
		this.dataSource.paginator = this.paginator;
		this.dataSource.sort = this.sort;
	}

	@Input() totalInvestedAmount: number | null = null;

	showDailyChange = false;

	displayedColumns: string[] = [
		'symbol',
		'price',
		'invested',
		'invested_xs',
		'volume',
		'statistics',
		'52WeekRange',
		'addditional_info',
	];

	dataSource!: MatTableDataSource<InvestmentAccountActiveHoldingOutputFragment>;

	constructor() {}

	ngOnInit(): void {}

	identity: TrackByFunction<InvestmentAccountActiveHoldingOutput> = (
		index: number,
		item: InvestmentAccountActiveHoldingOutput
	) => item.id;

	onItemClicked(item: InvestmentAccountActiveHoldingOutput): void {
		this.holdingClickedEmitter.emit(item);
	}

	onAddClick(): void {
		this.addEmitter.emit();
	}

	onShowHistoryClick(): void {
		this.showHistoryEmitter.emit();
	}

	toggleDailyChange(): void {
		this.showDailyChange = !this.showDailyChange;
	}
}

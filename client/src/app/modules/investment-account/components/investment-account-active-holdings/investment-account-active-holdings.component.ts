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
	selector: 'app-investment-account-active-holdings',
	templateUrl: './investment-account-active-holdings.component.html',
	styleUrls: ['./investment-account-active-holdings.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvestmentAccountActiveHoldingsComponent implements OnInit {
	@Output() holdingClickedEmitter = new EventEmitter<InvestmentAccountActiveHoldingOutputFragment>();

	@ViewChild(MatPaginator) paginator!: MatPaginator;
	@ViewChild(MatSort) sort!: MatSort;

	@Input() set activeHoldings(activeHoldingsData: InvestmentAccountActiveHoldingOutputFragment[]) {
		this.dataSource = new MatTableDataSource(activeHoldingsData);
		this.dataSource.paginator = this.paginator;
		this.dataSource.sort = this.sort;
	}

	showDailyChange = false;

	displayedColumns: string[] = [
		'symbol',
		'invested',
		'units',
		'bep',
		'price',
		'total',
		'volume',
		'portfolio_prct',
		'market_cap',
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

	toggleDailyChange(): void {
		this.showDailyChange = !this.showDailyChange;
	}
}

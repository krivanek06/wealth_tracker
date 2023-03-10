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
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {
	InvestmentAccountActiveHoldingOutput,
	InvestmentAccountActiveHoldingOutputFragment,
} from '../../../../core/graphql';
import { GeneralFunctionUtil } from '../../../../core/utils';

@Component({
	selector: 'app-investment-account-active-holdings-table',
	templateUrl: './investment-account-active-holdings-table.component.html',
	styleUrls: ['./investment-account-active-holdings-table.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvestmentAccountActiveHoldingsTableComponent implements OnInit {
	@Output() holdingClickedEmitter = new EventEmitter<InvestmentAccountActiveHoldingOutputFragment>();

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
		'volume',
		'invested_xs',
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

	toggleDailyChange(): void {
		this.showDailyChange = !this.showDailyChange;
	}

	sortData(sort: Sort) {
		const data = this.dataSource.data.slice();
		if (!sort.active || sort.direction === '') {
			this.dataSource.data = data;
			return;
		}

		this.dataSource.data = data.sort(
			(a: InvestmentAccountActiveHoldingOutputFragment, b: InvestmentAccountActiveHoldingOutputFragment) => {
				const isAsc = sort.direction === 'asc';
				switch (sort.active) {
					case 'symbol':
						return GeneralFunctionUtil.compare(a.units, b.units, isAsc);
					case 'price':
						return GeneralFunctionUtil.compare(a.assetGeneral.assetQuote.price, b.assetGeneral.assetQuote.price, isAsc);
					case 'invested':
						return GeneralFunctionUtil.compare(a.totalValue, b.totalValue, isAsc);
					default:
						return 0;
				}
			}
		);
	}
}

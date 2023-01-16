import { ChangeDetectionStrategy, Component, Input, OnInit, TrackByFunction, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { InvestmentAccountHoldingHistoryType, InvestmentAccountTransactionOutput } from '../../../../../core/graphql';
import { GeneralFunctionUtil } from '../../../../../core/utils';

@Component({
	selector: 'app-investment-account-transaction-table',
	templateUrl: './investment-account-transaction-table.component.html',
	styleUrls: ['./investment-account-transaction-table.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvestmentAccountTransactionTableComponent implements OnInit {
	@Input() set symbolSelect(values: string[] | null) {
		if (!values) {
			return;
		}

		this.dataSource.filterPredicate = (transaction: InvestmentAccountTransactionOutput) => {
			return values.length === 0 ? true : values.includes(transaction.assetId);
		};

		// trigger filter
		this.dataSource.filter = 'apply filter';
	}

	@Input() set transactions(data: InvestmentAccountTransactionOutput[] | null) {
		// order by date desc
		const value = (data ?? []).slice().sort((a, b) => GeneralFunctionUtil.compare(a.date, b.date, false));
		this.dataSource = new MatTableDataSource(value);
		this.dataSource.paginator = this.paginator;
	}

	@ViewChild(MatPaginator) paginator!: MatPaginator;

	dataSource!: MatTableDataSource<InvestmentAccountTransactionOutput>;

	displayedColumns: string[] = ['symbol', 'order', 'return', 'value', 'total', 'date'];

	InvestmentAccountHoldingHistoryType = InvestmentAccountHoldingHistoryType;

	constructor() {}

	ngOnInit(): void {}

	identity: TrackByFunction<InvestmentAccountTransactionOutput> = (
		index: number,
		item: InvestmentAccountTransactionOutput
	) => item.itemId;

	sortData(sort: Sort) {
		const data = this.dataSource.data.slice();
		if (!sort.active || sort.direction === '') {
			this.dataSource.data = data;
			return;
		}

		this.dataSource.data = data.sort((a: InvestmentAccountTransactionOutput, b: InvestmentAccountTransactionOutput) => {
			const isAsc = sort.direction === 'asc';
			switch (sort.active) {
				case 'symbol':
					return GeneralFunctionUtil.compare(a.assetId, b.assetId, isAsc);
				case 'order':
					return GeneralFunctionUtil.compare(a.type, b.type, isAsc);
				case 'return':
					return GeneralFunctionUtil.compare(a.return, b.return, isAsc);
				case 'total':
					return GeneralFunctionUtil.compare(a.units * a.unitValue, b.units * b.unitValue, isAsc);
				case 'date':
					return GeneralFunctionUtil.compare(a.date, b.date, isAsc);
				default:
					return 0;
			}
		});
	}
}

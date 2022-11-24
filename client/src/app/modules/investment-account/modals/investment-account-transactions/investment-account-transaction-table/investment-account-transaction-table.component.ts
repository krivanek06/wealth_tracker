import { ChangeDetectionStrategy, Component, Input, OnInit, TrackByFunction } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { InvestmentAccountTransactionOutput } from '../../../../../core/graphql';

@Component({
	selector: 'app-investment-account-transaction-table',
	templateUrl: './investment-account-transaction-table.component.html',
	styleUrls: ['./investment-account-transaction-table.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvestmentAccountTransactionTableComponent implements OnInit {
	@Input() set transactions(data: InvestmentAccountTransactionOutput[] | null) {
		this.dataSource = new MatTableDataSource(data ?? []);
	}

	dataSource!: MatTableDataSource<InvestmentAccountTransactionOutput>;

	displayedColumns: string[] = ['symbol', 'order', 'return', 'value', 'total'];

	constructor() {}

	ngOnInit(): void {}

	identity: TrackByFunction<InvestmentAccountTransactionOutput> = (
		index: number,
		item: InvestmentAccountTransactionOutput
	) => item.itemId;
}

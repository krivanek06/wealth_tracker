import { ChangeDetectionStrategy, Component, Input, OnInit, TrackByFunction, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { InvestmentAccountCashChangeFragment, InvestmentAccountCashChangeType } from '../../../../../core/graphql';
import { customMemoize } from '../../../../../shared/decoratos';

@Component({
	selector: 'app-investment-account-cash-change-item',
	templateUrl: './investment-account-cash-change-item.component.html',
	styleUrls: ['./investment-account-cash-change-item.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvestmentAccountCashChangeItemComponent implements OnInit {
	@Input() set cashChange(activeHoldingsData: InvestmentAccountCashChangeFragment[]) {
		const data = (activeHoldingsData ?? []).filter((d) => d.type !== InvestmentAccountCashChangeType.AssetOperation);
		this.dataSource = new MatTableDataSource(data);
		this.dataSource.paginator = this.paginator;
	}

	@ViewChild(MatPaginator) paginator!: MatPaginator;

	displayedColumns: string[] = ['type', 'value'];

	dataSource!: MatTableDataSource<InvestmentAccountCashChangeFragment>;

	InvestmentAccountCashChangeType = InvestmentAccountCashChangeType;

	constructor() {}

	ngOnInit(): void {}

	identity: TrackByFunction<InvestmentAccountCashChangeFragment> = (
		index: number,
		item: InvestmentAccountCashChangeFragment
	) => item.itemId;

	@customMemoize()
	getNameFromType(type: InvestmentAccountCashChangeType): string {
		if (type === InvestmentAccountCashChangeType.AssetOperation) {
			return 'Asset';
		}
		return type.toLowerCase();
	}
}

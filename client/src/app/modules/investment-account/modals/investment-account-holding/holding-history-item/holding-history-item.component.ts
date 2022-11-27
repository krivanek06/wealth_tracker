import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { InvestmentAccountHoldingHistoryType, InvestmentAccountTransactionOutput } from '../../../../../core/graphql';

@Component({
	selector: 'app-holding-history-item',
	templateUrl: './holding-history-item.component.html',
	styleUrls: ['./holding-history-item.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HoldingHistoryItemComponent implements OnInit {
	@Input() history!: InvestmentAccountTransactionOutput;

	InvestmentAccountHoldingHistoryType = InvestmentAccountHoldingHistoryType;
	constructor() {}

	ngOnInit(): void {}
}

import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { DailyInvestmentChange } from '../../models';

@Component({
	selector: 'app-investment-account-state',
	templateUrl: './investment-account-state.component.html',
	styleUrls: ['./investment-account-state.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvestmentAccountStateComponent implements OnInit {
	/**
	 * Total invested amount by the user
	 */
	@Input() totalInvestedAmount!: number;

	/**
	 * Current state of investments -> holding.price * units
	 */
	@Input() currentInvestedAmout!: number;

	@Input() cashAmount!: number;
	@Input() dailyInvestmentChange!: DailyInvestmentChange | null;

	constructor() {}

	ngOnInit(): void {}
}

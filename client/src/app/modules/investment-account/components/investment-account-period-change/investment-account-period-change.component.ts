import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { InvestmentAccountPeriodChange } from '../../models';

@Component({
	selector: 'app-investment-account-period-change',
	templateUrl: './investment-account-period-change.component.html',
	styleUrls: ['./investment-account-period-change.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvestmentAccountPeriodChangeComponent implements OnInit {
	@Input() periodChange!: InvestmentAccountPeriodChange;

	constructor() {}

	ngOnInit(): void {}
}

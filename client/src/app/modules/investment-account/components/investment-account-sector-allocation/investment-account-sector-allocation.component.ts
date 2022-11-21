import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { SectorAllocationCalculation } from '../../models';

@Component({
	selector: 'app-investment-account-sector-allocation',
	templateUrl: './investment-account-sector-allocation.component.html',
	styleUrls: ['./investment-account-sector-allocation.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvestmentAccountSectorAllocationComponent implements OnInit {
	@Input() allocation!: SectorAllocationCalculation;
	@Input() totalInvestedAmount!: number;

	constructor() {}

	ngOnInit(): void {}
}

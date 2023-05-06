import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { PerceptageIncreaseDirective } from '../../../../shared/directives';
import { InvestmentAccountPeriodChange } from '../../models';

@Component({
	selector: 'app-investment-account-period-change',
	templateUrl: './investment-account-period-change.component.html',
	styleUrls: ['./investment-account-period-change.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [CommonModule, PerceptageIncreaseDirective],
})
export class InvestmentAccountPeriodChangeComponent implements OnInit {
	@Input() periodChange!: InvestmentAccountPeriodChange;

	constructor() {}

	ngOnInit(): void {}
}

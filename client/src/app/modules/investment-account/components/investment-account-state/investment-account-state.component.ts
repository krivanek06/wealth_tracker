import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { InvestmentAccountFragment } from '../../../../core/graphql';
import { PerceptageIncreaseDirective } from '../../../../shared/directives';
import { DailyInvestmentChange } from '../../models';
import { InvestmentAccountCalculatorService } from '../../services';

@Component({
	selector: 'app-investment-account-state',
	templateUrl: './investment-account-state.component.html',
	styleUrls: ['./investment-account-state.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [CommonModule, MatButtonModule, MatIconModule, PerceptageIncreaseDirective],
})
export class InvestmentAccountStateComponent implements OnInit {
	@Output() cashChangeClickEmitter = new EventEmitter<void>();
	@Input() set investmentAccount(account: InvestmentAccountFragment | null) {
		if (!account) {
			return;
		}

		this.currentInvestedAmout =
			this.investmentAccountCalculatorService.getInvestmentAccountByIdCurrentInvestedAmout(account);

		this.cashAmount = account.cashChange[account.cashChange.length - 1]?.cashValue ?? 0;

		this.dailyInvestmentChange = this.investmentAccountCalculatorService.getDailyInvestmentChange(account);

		this.totalInvestedAmount =
			this.investmentAccountCalculatorService.getInvestmentAccountByIdTotalInvestedAmount(account);
	}

	/**
	 * Total invested amount by the user
	 */
	totalInvestedAmount?: number;

	/**
	 * Current state of investments -> holding.price * units
	 */
	currentInvestedAmout?: number;

	cashAmount?: number;

	/**
	 * Daily sum and percentage change for investment account
	 */
	dailyInvestmentChange?: DailyInvestmentChange | null;

	constructor(private investmentAccountCalculatorService: InvestmentAccountCalculatorService) {}

	ngOnInit(): void {}

	onCashChangeClick(): void {
		this.cashChangeClickEmitter.emit();
	}
}

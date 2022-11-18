import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { InvestmentAccountApiService } from '../../../../core/api';
import {
	InvestmentAccountFragment,
	InvestmentAccountGrowth,
	InvestmentAccountOverviewFragment,
} from '../../../../core/graphql';
import { DailyInvestmentChange } from '../../models';
import { InvestmentAccountCalculatorService } from '../../services';

@Component({
	selector: 'app-investment-account',
	templateUrl: './investment-account.component.html',
	styleUrls: ['./investment-account.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvestmentAccountComponent implements OnInit {
	@Input() investmentAccountsOverivew!: InvestmentAccountOverviewFragment;

	investmentAccount$!: Observable<InvestmentAccountFragment>;

	/**
	 * Total invested amount by the user
	 */
	totalInvestedAmount$!: Observable<number>;

	/**
	 * Current state of investments -> holding.price * units
	 */
	currentInvestedAmout$!: Observable<number>;

	/**
	 * Daily sum and percentage change for investment account
	 */
	dailyInvestmentChange$!: Observable<DailyInvestmentChange>;

	/**
	 * Growth of the investment account + cash
	 */
	investmentAccountGrowth$!: Observable<InvestmentAccountGrowth[]>;

	constructor(
		private investmentAccountApiService: InvestmentAccountApiService,
		private investmentAccountCalculatorService: InvestmentAccountCalculatorService
	) {}

	ngOnInit(): void {
		const investmentId = this.investmentAccountsOverivew.id;
		this.investmentAccount$ = this.investmentAccountApiService.getInvestmentAccountById(investmentId);
		this.investmentAccountGrowth$ = this.investmentAccountApiService.getInvestmentAccountGrowth(investmentId);

		this.totalInvestedAmount$ =
			this.investmentAccountCalculatorService.getInvestmentAccountByIdTotalInvestedAmount(investmentId);
		this.currentInvestedAmout$ =
			this.investmentAccountCalculatorService.getInvestmentAccountByIdCurrentInvestedAmout(investmentId);
		this.dailyInvestmentChange$ = this.investmentAccountCalculatorService.getDailyInvestmentChange(investmentId);

		// TODO remove
		this.dailyInvestmentChange$.subscribe(console.log);
		this.currentInvestedAmout$.subscribe(console.log);
		this.totalInvestedAmount$.subscribe(console.log);
	}
}

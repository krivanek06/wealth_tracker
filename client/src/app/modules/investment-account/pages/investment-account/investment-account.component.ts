import { BreakpointObserver } from '@angular/cdk/layout';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';
import { InvestmentAccountApiService } from '../../../../core/api';
import {
	InvestmentAccountFragment,
	InvestmentAccountGrowth,
	InvestmentAccountOverviewFragment,
} from '../../../../core/graphql';
import { LAYOUT_2XL } from '../../../../shared/models';
import { DailyInvestmentChange, SectorAllocationCalculation } from '../../models';
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

	/**
	 * Symbols allocated by sectors
	 */
	sectorAllocation$!: Observable<SectorAllocationCalculation[]>;

	layout2XL$!: Observable<boolean>;

	constructor(
		private investmentAccountApiService: InvestmentAccountApiService,
		private investmentAccountCalculatorService: InvestmentAccountCalculatorService,
		private breakpointObserver: BreakpointObserver
	) {}

	ngOnInit(): void {
		const investmentId = this.investmentAccountsOverivew.id;
		this.investmentAccount$ = this.investmentAccountApiService.getInvestmentAccountById(investmentId);
		this.investmentAccountGrowth$ = this.investmentAccountApiService.getInvestmentAccountGrowth(investmentId);
		this.sectorAllocation$ = this.investmentAccountCalculatorService.getSectorAllocation(investmentId);

		this.layout2XL$ = this.breakpointObserver.observe([LAYOUT_2XL]).pipe(map((res) => res.matches));

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

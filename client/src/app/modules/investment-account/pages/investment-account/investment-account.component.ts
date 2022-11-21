import { BreakpointObserver } from '@angular/cdk/layout';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { combineLatest, map, Observable, startWith } from 'rxjs';
import { InvestmentAccountApiService } from '../../../../core/api';
import {
	InvestmentAccountActiveHoldingOutputFragment,
	InvestmentAccountFragment,
	InvestmentAccountGrowth,
	InvestmentAccountOverviewFragment,
} from '../../../../core/graphql';
import { LAYOUT_2XL, ValuePresentItem } from '../../../../shared/models';
import { DailyInvestmentChange, SectorAllocation } from '../../models';
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
	sectorAllocation$!: Observable<ValuePresentItem<SectorAllocation>[]>;

	layout2XL$!: Observable<boolean>;

	// keeps track of visible sectors, if empty -> all is visible
	sectorFormControl = new FormControl<SectorAllocation[]>([], { nonNullable: true });

	/**
	 * Active holdings that match sector if sectorFormControl not empty
	 */
	filteredActiveHoldings$!: Observable<InvestmentAccountActiveHoldingOutputFragment[]>;

	constructor(
		private investmentAccountApiService: InvestmentAccountApiService,
		private investmentAccountCalculatorService: InvestmentAccountCalculatorService,
		private breakpointObserver: BreakpointObserver
	) {}

	ngOnInit(): void {
		const investmentId = this.investmentAccountsOverivew.id;
		this.investmentAccount$ = this.investmentAccountApiService.getInvestmentAccountById(investmentId);
		this.investmentAccountGrowth$ = this.investmentAccountApiService.getInvestmentAccountGrowth(investmentId);

		this.filteredActiveHoldings$ = combineLatest([
			this.investmentAccount$,
			this.sectorFormControl.valueChanges.pipe(startWith(this.sectorFormControl.value)),
		]).pipe(
			map(([account, sectors]) =>
				account.activeHoldings.filter(
					(d) => sectors.length === 0 || sectors.map((x) => x.sectorName).includes(d.sector)
				)
			)
		);

		this.layout2XL$ = this.breakpointObserver.observe([LAYOUT_2XL]).pipe(map((res) => res.matches));

		this.sectorAllocation$ = this.investmentAccount$.pipe(
			map((acount) => this.investmentAccountCalculatorService.getSectorAllocation(acount))
		);

		this.totalInvestedAmount$ = this.investmentAccount$.pipe(
			map((acount) => this.investmentAccountCalculatorService.getInvestmentAccountByIdTotalInvestedAmount(acount))
		);

		this.currentInvestedAmout$ = this.investmentAccount$.pipe(
			map((account) => this.investmentAccountCalculatorService.getInvestmentAccountByIdCurrentInvestedAmout(account))
		);
		this.dailyInvestmentChange$ = this.investmentAccount$.pipe(
			map((account) => this.investmentAccountCalculatorService.getDailyInvestmentChange(account))
		);
	}
}

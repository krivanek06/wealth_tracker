import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { combineLatest, map, Observable, startWith } from 'rxjs';
import { InvestmentAccountFacadeApiService } from '../../../../core/api';
import {
	AccountIdentification,
	InvestmentAccountActiveHoldingOutputFragment,
	InvestmentAccountFragment,
	InvestmentAccountGrowth,
} from '../../../../core/graphql';
import { ValuePresentItem } from '../../../../shared/models';
import {
	InvestmentAccountCashChangeComponent,
	InvestmentAccountHoldingComponent,
	InvestmentAccountTransactionsComponent,
} from '../../modals';
import { DailyInvestmentChange, InvestmentAccountPeriodChange, SectorAllocation } from '../../models';
import { InvestmentAccountCalculatorService } from '../../services';

@Component({
	selector: 'app-investment-account',
	templateUrl: './investment-account.component.html',
	styleUrls: ['./investment-account.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvestmentAccountComponent implements OnInit {
	@Input() investmentAccountsOverview!: AccountIdentification;

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

	/**
	 * Investment account change over period of times - 1week, 1month, etc.
	 */
	accountPeriodChange$!: Observable<InvestmentAccountPeriodChange[]>;

	// keeps track of visible sectors, if empty -> all is visible
	sectorFormControl = new FormControl<SectorAllocation[]>([], { nonNullable: true });

	/**
	 * Active holdings that match sector if sectorFormControl not empty
	 */
	filteredActiveHoldings$!: Observable<InvestmentAccountActiveHoldingOutputFragment[]>;

	private investmentId!: string;

	constructor(
		private investmentAccountFacadeApiService: InvestmentAccountFacadeApiService,
		private investmentAccountCalculatorService: InvestmentAccountCalculatorService,
		private dialog: MatDialog
	) {}

	ngOnInit(): void {
		this.investmentId = this.investmentAccountsOverview.id;
		this.investmentAccount$ = this.investmentAccountFacadeApiService.getInvestmentAccountById(this.investmentId);
		this.investmentAccountGrowth$ = this.investmentAccountFacadeApiService.getInvestmentAccountGrowth(
			this.investmentId
		);
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
		this.sectorAllocation$ = this.investmentAccount$.pipe(
			map((account) => this.investmentAccountCalculatorService.getSectorAllocation(account))
		);
		this.totalInvestedAmount$ = this.investmentAccount$.pipe(
			map((account) => this.investmentAccountCalculatorService.getInvestmentAccountByIdTotalInvestedAmount(account))
		);
		this.currentInvestedAmout$ = this.investmentAccount$.pipe(
			map((account) => this.investmentAccountCalculatorService.getInvestmentAccountByIdCurrentInvestedAmout(account))
		);
		this.dailyInvestmentChange$ = this.investmentAccount$.pipe(
			map((account) => this.investmentAccountCalculatorService.getDailyInvestmentChange(account))
		);
		this.accountPeriodChange$ = combineLatest([this.investmentAccount$, this.investmentAccountGrowth$]).pipe(
			map(([account, growth]) =>
				this.investmentAccountCalculatorService.getInvestmentAccountPeriodChange(account.activeHoldings, growth)
			)
		);
	}

	onChangeChangeClick(): void {
		this.dialog.open(InvestmentAccountCashChangeComponent, {
			data: {
				investmentId: this.investmentId,
			},
			panelClass: ['g-mat-dialog-big'],
		});
	}

	onAddHolding(holding?: InvestmentAccountActiveHoldingOutputFragment): void {
		this.dialog.open(InvestmentAccountHoldingComponent, {
			data: {
				investmentId: this.investmentId,
				selectedAsset: holding?.assetGeneral,
			},
			panelClass: ['g-mat-dialog-big'],
		});
	}

	onShowHisotry(): void {
		this.dialog.open(InvestmentAccountTransactionsComponent, {
			data: {
				investmentId: this.investmentId,
			},
			panelClass: ['g-mat-dialog-big'],
			minHeight: '50vh',
		});
	}
}

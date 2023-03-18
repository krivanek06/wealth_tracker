import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, map, Observable, startWith } from 'rxjs';
import { InvestmentAccountFragmentExtended } from '../../../../core/models';

import { InvestmentAccountFacadeApiService } from '../../../../core/api';
import {
	InvestmentAccountActiveHoldingOutputFragment,
	InvestmentAccountGrowth,
	InvestmentAccountOverviewFragment,
} from '../../../../core/graphql';
import {
	GenericChartSeriesPie,
	InputSource,
	NONE_INPUT_SOURCE,
	NONE_INPUT_SOURCE_VALUE,
} from '../../../../shared/models';
import {
	InvestmentAccountCashChangeComponent,
	InvestmentAccountHoldingComponent,
	InvestmentAccountTransactionsComponent,
} from '../../modals';
import { InvestmentAccountPeriodChange } from '../../models';
import { InvestmentAccountCalculatorService } from '../../services';

@Component({
	selector: 'app-welcome-investment-account',
	templateUrl: './investment-account.component.html',
	styleUrls: ['./investment-account.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvestmentAccountComponent implements OnInit {
	investmentAccountsOverview!: InvestmentAccountOverviewFragment;

	investmentAccount$!: Observable<InvestmentAccountFragmentExtended>;

	/**
	 * Total invested amount by the user
	 */
	totalInvestedAmount$!: Observable<number>;

	/**
	 * Growth of the investment account + cash
	 */
	investmentAccountGrowth$!: Observable<InvestmentAccountGrowth[]>;

	/**
	 * Symbols allocated by sectors
	 */
	sectorAllocationInputSource$!: Observable<InputSource[]>;
	sectorAllocationChart$!: Observable<GenericChartSeriesPie>;
	assetAllocationChart$!: Observable<GenericChartSeriesPie>;

	/**
	 * Investment account change over period of times - 1week, 1month, etc.
	 */
	accountPeriodChange$!: Observable<InvestmentAccountPeriodChange[]>;

	// keeps track of visible sectors, if empty -> all is visible
	sectorFormControl = new FormControl<InputSource>(NONE_INPUT_SOURCE, { nonNullable: true });

	/**
	 * Active holdings that match sector if sectorFormControl not empty
	 */
	filteredActiveHoldings$!: Observable<InvestmentAccountActiveHoldingOutputFragment[]>;

	private investmentId!: string;

	constructor(
		private investmentAccountFacadeApiService: InvestmentAccountFacadeApiService,
		private investmentAccountCalculatorService: InvestmentAccountCalculatorService,
		private dialog: MatDialog,
		private route: ActivatedRoute
	) {}

	ngOnInit(): void {
		this.investmentAccount$ = this.investmentAccountFacadeApiService.getInvestmentAccountByUser();
		this.investmentAccountGrowth$ = this.investmentAccountFacadeApiService.getInvestmentAccountGrowth();
		this.filteredActiveHoldings$ = combineLatest([
			this.investmentAccount$,
			this.sectorFormControl.valueChanges.pipe(startWith(this.sectorFormControl.value)),
		]).pipe(
			map(([account, sectorInputSource]) =>
				account.activeHoldings.filter(
					(d) => sectorInputSource.value === NONE_INPUT_SOURCE_VALUE || d.sector === sectorInputSource.value
				)
			)
		);

		this.sectorAllocationInputSource$ = this.investmentAccount$.pipe(
			map((account) => this.investmentAccountCalculatorService.getSectorAllocationInputSource(account))
		);
		this.sectorAllocationChart$ = this.investmentAccount$.pipe(
			map((account) => this.investmentAccountCalculatorService.getSectorAllocationChart(account))
		);
		this.assetAllocationChart$ = this.investmentAccount$.pipe(
			map((account) => this.investmentAccountCalculatorService.getAssetAllocationChart(account))
		);

		this.totalInvestedAmount$ = this.investmentAccount$.pipe(
			map((account) => this.investmentAccountCalculatorService.getInvestmentAccountByIdTotalInvestedAmount(account))
		);

		this.accountPeriodChange$ = combineLatest([this.investmentAccount$, this.investmentAccountGrowth$]).pipe(
			map(([account, growth]) =>
				this.investmentAccountCalculatorService.getInvestmentAccountPeriodChange(account.activeHoldings, growth)
			)
		);
	}

	onCashChangeClick(): void {
		this.dialog.open(InvestmentAccountCashChangeComponent, {
			data: {
				investmentId: this.investmentId,
			},
			panelClass: ['g-mat-dialog-small'],
		});
	}

	onAddHolding(activeHolding?: InvestmentAccountActiveHoldingOutputFragment): void {
		this.dialog.open(InvestmentAccountHoldingComponent, {
			data: {
				investmentId: this.investmentId,
				activeHolding: activeHolding,
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

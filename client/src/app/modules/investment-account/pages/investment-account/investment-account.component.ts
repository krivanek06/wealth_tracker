import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, map, Observable, startWith } from 'rxjs';
import { InvestmentAccountFacadeApiService } from '../../../../core/api';
import {
	ACCOUNT_KEY,
	InvestmentAccountActiveHoldingOutputFragment,
	InvestmentAccountFragment,
	InvestmentAccountGrowth,
	InvestmentAccountOverviewFragment,
} from '../../../../core/graphql';
import { InputSource, NONE_INPUT_SOURCE, NONE_INPUT_SOURCE_VALUE } from '../../../../shared/models';
import {
	InvestmentAccountCashChangeComponent,
	InvestmentAccountHoldingComponent,
	InvestmentAccountTransactionsComponent,
} from '../../modals';
import { InvestmentAccountPeriodChange } from '../../models';
import { InvestmentAccountCalculatorService } from '../../services';

@Component({
	selector: 'app-investment-account',
	templateUrl: './investment-account.component.html',
	styleUrls: ['./investment-account.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvestmentAccountComponent implements OnInit {
	investmentAccountsOverview!: InvestmentAccountOverviewFragment;

	investmentAccount$!: Observable<InvestmentAccountFragment>;

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
		this.investmentAccountsOverview = this.route.snapshot.data?.[ACCOUNT_KEY] as InvestmentAccountOverviewFragment;
		this.investmentId = this.investmentAccountsOverview.id;
		this.investmentAccount$ = this.investmentAccountFacadeApiService.getInvestmentAccountById(this.investmentId);
		this.investmentAccountGrowth$ = this.investmentAccountFacadeApiService.getInvestmentAccountGrowth(
			this.investmentId
		);
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

		this.totalInvestedAmount$ = this.investmentAccount$.pipe(
			map((account) => this.investmentAccountCalculatorService.getInvestmentAccountByIdTotalInvestedAmount(account))
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

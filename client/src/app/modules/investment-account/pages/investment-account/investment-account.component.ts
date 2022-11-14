import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { InvestmentAccountApiService } from '../../../../core/api';
import { InvestmentAccountFragment, InvestmentAccountOverviewFragment } from '../../../../core/graphql';

@Component({
	selector: 'app-investment-account',
	templateUrl: './investment-account.component.html',
	styleUrls: ['./investment-account.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvestmentAccountComponent implements OnInit {
	@Input() investmentAccountsOverivew!: InvestmentAccountOverviewFragment;

	investmentAccount$!: Observable<InvestmentAccountFragment>;
	totalInvestedAmount$!: Observable<number>;
	currentInvestedAmout$!: Observable<number>;

	constructor(private investmentAccountApiService: InvestmentAccountApiService) {}

	ngOnInit(): void {
		const investmentId = this.investmentAccountsOverivew.id;
		this.investmentAccount$ = this.investmentAccountApiService.getInvestmentAccountById(investmentId);

		this.totalInvestedAmount$ =
			this.investmentAccountApiService.getInvestmentAccountByIdTotalInvestedAmount(investmentId);
		this.currentInvestedAmout$ =
			this.investmentAccountApiService.getInvestmentAccountByIdCurrentInvestedAmout(investmentId);

		// TODO remove
		this.totalInvestedAmount$.subscribe(console.log);
		this.currentInvestedAmout$.subscribe(console.log);
		this.investmentAccount$.subscribe(console.log);
	}
}

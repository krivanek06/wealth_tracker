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

	constructor(private investmentAccountApiService: InvestmentAccountApiService) {}

	ngOnInit(): void {
		this.investmentAccount$ = this.investmentAccountApiService.getInvestmentAccountById(
			this.investmentAccountsOverivew.id
		);

		this.investmentAccount$.subscribe(console.log);
	}
}

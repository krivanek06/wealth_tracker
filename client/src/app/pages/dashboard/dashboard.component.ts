import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { mergeMap, Observable, zip } from 'rxjs';
import { InvestmentAccountFacadeApiService, PersonalAccountFacadeService } from '../../core/api';
import { AccountIdentification } from '../../core/graphql';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
	availableAccounts$!: Observable<AccountIdentification[]>;

	constructor(
		private personalAccountFacadeService: PersonalAccountFacadeService,
		private investmentAccountFacadeApiService: InvestmentAccountFacadeApiService
	) {}

	ngOnInit(): void {
		this.availableAccounts$ = zip(
			// flatten by merge map
			this.personalAccountFacadeService.getPersonalAccounts().pipe(mergeMap((d) => d)),
			// flatten by merge map
			this.investmentAccountFacadeApiService.getInvestmentAccounts().pipe(mergeMap((d) => d))
		);

		this.availableAccounts$.subscribe(console.log);
	}
}

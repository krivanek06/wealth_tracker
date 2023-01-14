import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { filter, first, mergeMap, Observable, zip } from 'rxjs';
import { InvestmentAccountFacadeApiService, PersonalAccountFacadeService } from '../../core/api';
import { AccountIdentification, AccountType } from '../../core/graphql';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
	availableAccounts$!: Observable<AccountIdentification[]>;

	AccountType = AccountType;
	accountFormControl = new FormControl<AccountIdentification | null>(null);

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

		// select first account if exists
		this.availableAccounts$
			.pipe(
				filter((res) => !!res),
				first()
			)
			.subscribe((res) => (this.accountFormControl = new FormControl(res[0])));
	}
}

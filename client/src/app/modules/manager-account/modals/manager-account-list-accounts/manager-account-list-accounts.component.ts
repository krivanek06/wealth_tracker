import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { InvestmentAccountFacadeApiService, PersonalAccountApiService } from '../../../../core/api';
import { InvestmentAccountOverviewFragment, PersonalAccountOverviewBasicFragment } from '../../../../core/graphql';

@Component({
	selector: 'app-manager-account-list-accounts',
	templateUrl: './manager-account-list-accounts.component.html',
	styleUrls: ['./manager-account-list-accounts.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManagerAccountListAccountsComponent implements OnInit {
	personalAccounts$!: Observable<PersonalAccountOverviewBasicFragment[]>;
	investmentAccounts$!: Observable<InvestmentAccountOverviewFragment[]>;

	constructor(
		private personalAccountApiService: PersonalAccountApiService,
		private investmentAccountFacadeApiService: InvestmentAccountFacadeApiService
	) {}

	ngOnInit(): void {
		this.personalAccounts$ = this.personalAccountApiService.getPersonalAccounts();
		this.investmentAccounts$ = this.investmentAccountFacadeApiService.getInvestmentAccounts();
	}
}

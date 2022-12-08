import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { InvestmentAccountFacadeApiService, PersonalAccountApiService } from '../../../../core/api';
import { InvestmentAccountOverviewFragment, PersonalAccountOverviewBasicFragment } from '../../../../core/graphql';
import { GeneralAccounts } from '../../models';

@Component({
	selector: 'app-manager-account-list-accounts',
	templateUrl: './manager-account-list-accounts.component.html',
	styleUrls: ['./manager-account-list-accounts.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManagerAccountListAccountsComponent implements OnInit {
	personalAccounts$!: Observable<PersonalAccountOverviewBasicFragment[]>;
	investmentAccounts$!: Observable<InvestmentAccountOverviewFragment[]>;

	selectedAccountControl = new FormControl<GeneralAccounts | null>(null);

	constructor(
		private personalAccountApiService: PersonalAccountApiService,
		private investmentAccountFacadeApiService: InvestmentAccountFacadeApiService
	) {}

	ngOnInit(): void {
		this.personalAccounts$ = this.personalAccountApiService.getPersonalAccounts();
		this.investmentAccounts$ = this.investmentAccountFacadeApiService.getInvestmentAccounts();

		this.selectedAccountControl.valueChanges.subscribe(console.log);
	}
}

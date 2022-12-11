import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { InvestmentAccountFacadeApiService, PersonalAccountFacadeService } from '../../core/api';
import { InvestmentAccountOverviewFragment, PersonalAccountOverviewBasicFragment } from '../../core/graphql';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
	personalAccountBasic$!: Observable<PersonalAccountOverviewBasicFragment[]>;
	investmentAccountsOverivew$!: Observable<InvestmentAccountOverviewFragment[]>;
	constructor(
		private personalAccountFacadeService: PersonalAccountFacadeService,
		private investmentAccountFacadeApiService: InvestmentAccountFacadeApiService
	) {}

	ngOnInit(): void {
		this.personalAccountBasic$ = this.personalAccountFacadeService.getPersonalAccounts();
		this.investmentAccountsOverivew$ = this.investmentAccountFacadeApiService.getInvestmentAccounts();
	}
}

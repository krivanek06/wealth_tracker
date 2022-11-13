import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { InvestmentAccountApiService, PersonalAccountApiService } from '../../core/api';
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
		private personalAccountApiService: PersonalAccountApiService,
		private InvestmentAccountApiService: InvestmentAccountApiService
	) {}

	ngOnInit(): void {
		this.personalAccountBasic$ = this.personalAccountApiService.getPersonalAccounts();
		this.investmentAccountsOverivew$ = this.InvestmentAccountApiService.getInvestmentAccounts();
	}
}

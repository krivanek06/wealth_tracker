import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { InvestmentAccountFacadeApiService, PersonalAccountFacadeService } from '../../core/api';
import { AccountCreation } from '../page-shared/header-container/header-model';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
	availableAccounts$!: Observable<AccountCreation[]>;

	constructor(
		private personalAccountFacadeService: PersonalAccountFacadeService,
		private investmentAccountFacadeApiService: InvestmentAccountFacadeApiService
	) {}

	ngOnInit(): void {}
}

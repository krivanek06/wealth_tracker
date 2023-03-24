import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AccountManagerApiService } from '../../core/api';
import { AccountManagerRoutes, DASHBOARD_ROUTES, TOP_LEVEL_NAV } from '../../core/models';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
	availableAccounts$!: Observable<AccountManagerRoutes[]>;

	constructor(private managerAccountApiService: AccountManagerApiService, private router: Router) {}

	ngOnInit(): void {
		this.availableAccounts$ = this.managerAccountApiService.getAvailableAccountRoutes();
	}

	onAccountCreateNav(): void {
		this.router.navigate([TOP_LEVEL_NAV.dashboard, DASHBOARD_ROUTES.NO_ACCOUNT]);
	}
}

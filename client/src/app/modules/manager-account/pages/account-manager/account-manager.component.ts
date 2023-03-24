import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AccountManagerApiService } from '../../../../core/api';
import { AccountManagerRoutes, TOP_LEVEL_NAV } from '../../../../core/models';

@Component({
	selector: 'app-account-manager',
	templateUrl: './account-manager.component.html',
	styleUrls: ['./account-manager.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountManagerComponent {
	availableAccounts$!: Observable<AccountManagerRoutes[]>;

	constructor(private managerAccountApiService: AccountManagerApiService, private router: Router) {}

	ngOnInit(): void {
		this.availableAccounts$ = this.managerAccountApiService.getAvailableAccountRoutes();
	}

	onRouteClick(route: string) {
		this.router.navigate([TOP_LEVEL_NAV.dashboard, route]);
	}
}

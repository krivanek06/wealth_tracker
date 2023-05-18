import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AccountIdentificationFragment, AccountType, GetAvailableAccountsGQL } from '../../graphql';
import { AccountManagerRoutes, DASHBOARD_ROUTES_BY_TYPE } from '../../models';

@Injectable({
	providedIn: 'root',
})
export class AccountManagerApiService {
	constructor(private getAvailableAccountsGQL: GetAvailableAccountsGQL) {}

	getAvailableAccounts(): Observable<AccountIdentificationFragment[]> {
		return this.getAvailableAccountsGQL
			.watch()
			.valueChanges.pipe(
				map((d) =>
					d.data.getAvailableAccounts.slice().sort((a, b) => (a.accountType === AccountType.Personal ? -1 : 1))
				)
			);
	}

	getAvailableAccountRoutes(): Observable<AccountManagerRoutes[]> {
		return this.getAvailableAccounts().pipe(
			map((res) =>
				res.map((d) => {
					const data: AccountManagerRoutes = {
						route: DASHBOARD_ROUTES_BY_TYPE[d.accountType],
						data: d,
					};
					return data;
				})
			)
		);
	}
}

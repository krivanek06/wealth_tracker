import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { map, Observable } from 'rxjs';
import { InvestmentAccountFacadeApiService } from './../../../core/api';
import { InvestmentAccountOverviewFragment } from './../../../core/graphql';

@Injectable({
	providedIn: 'root',
})
export class InvestmentAccountResolverGuard
	implements Resolve<Observable<InvestmentAccountOverviewFragment | undefined>>
{
	constructor(private investmentAccountFacadeApiService: InvestmentAccountFacadeApiService) {}

	resolve(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): Observable<InvestmentAccountOverviewFragment | undefined> {
		const accountId = route.params?.['id'];

		return this.investmentAccountFacadeApiService
			.getInvestmentAccounts()
			.pipe(map((accounts) => accounts.find((d) => d.id === accountId)));
	}
}

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { map, Observable } from 'rxjs';
import { PersonalAccountFacadeService } from '../../../core/api';
import { PersonalAccountOverviewFragment } from '../../../core/graphql';

@Injectable({
	providedIn: 'root',
})
export class PersonalAccountResolverGuard implements Resolve<Observable<PersonalAccountOverviewFragment | undefined>> {
	constructor(private personalAccountFacadeApiService: PersonalAccountFacadeService) {}

	resolve(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): Observable<PersonalAccountOverviewFragment | undefined> {
		const accountId = route.params?.['id'];

		return this.personalAccountFacadeApiService
			.getPersonalAccounts()
			.pipe(map((accounts) => accounts.find((d) => d.id === accountId)));
	}
}

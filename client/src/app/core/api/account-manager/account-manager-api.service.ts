import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AccountIdentificationFragment, GetAvailableAccountsGQL } from '../../graphql';

@Injectable({
	providedIn: 'root',
})
export class AccountManagerApiService {
	constructor(private getAvailableAccountsGQL: GetAvailableAccountsGQL) {}

	getAvailableAccounts(): Observable<AccountIdentificationFragment[]> {
		return this.getAvailableAccountsGQL.watch().valueChanges.pipe(map((d) => d.data.getAvailableAccounts));
	}
}

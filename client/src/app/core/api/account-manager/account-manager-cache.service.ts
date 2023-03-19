import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import {
	AccountIdentification,
	AccountIdentificationFragment,
	AccountIdentificationFragmentDoc,
	AccountType,
	GetAvailableAccountsDocument,
	GetAvailableAccountsQuery,
	InvestmentAccountOverviewFragment,
	PersonalAccountOverviewFragment,
} from '../../graphql';

@Injectable({
	providedIn: 'root',
})
export class AccountManagerCacheService {
	constructor(private apollo: Apollo) {}

	createAccountType(result: PersonalAccountOverviewFragment | InvestmentAccountOverviewFragment): void {
		const identification: AccountIdentificationFragment = {
			__typename: 'AccountIdentification',
			id: result.id,
			accountType: result.accountType,
			createdAt: result.createdAt,
			userId: result.userId,
			name: result.name,
		};

		const accounts = this.getAccountsOverview();

		// update cache
		this.updateAccountsOverview([...accounts, identification]);
	}

	renameAccountType(name: string, type: AccountType): void {
		const accounts = this.getAccountsOverview();
		const accountSelected = accounts.find((d) => d.accountType === type);

		if (!accountSelected) {
			return;
		}

		// update cache
		this.updateAccountType({ ...accountSelected, name });
	}

	removeAccountType(type: AccountType): void {
		// load accounts from cache
		const accounts = this.getAccountsOverview();
		const updatedAccounts = accounts.filter((d) => d.accountType !== type);

		// update cache
		this.updateAccountsOverview([...updatedAccounts]);
	}

	getAccountsOverview(): AccountIdentificationFragment[] {
		const query = this.apollo.client.readQuery<GetAvailableAccountsQuery>({
			query: GetAvailableAccountsDocument,
		});

		return query?.getAvailableAccounts ?? [];
	}

	updateAccountsOverview(data: AccountIdentificationFragment[]): void {
		this.apollo.client.writeQuery<GetAvailableAccountsQuery>({
			query: GetAvailableAccountsDocument,
			data: {
				__typename: 'Query',
				getAvailableAccounts: [...data],
			},
		});
	}

	private getAccountType(tagId: string): AccountIdentificationFragment | null {
		const fragment = this.apollo.client.readFragment<AccountIdentificationFragment>({
			id: `AccountIdentification:${tagId}`,
			fragment: AccountIdentificationFragmentDoc,
		});
		return fragment;
	}

	private updateAccountType(data: AccountIdentification): void {
		this.apollo.client.writeFragment<AccountIdentificationFragment>({
			id: `AccountIdentification:${data.id}`,
			fragmentName: 'AccountIdentification',
			fragment: AccountIdentificationFragmentDoc,
			data: {
				...data,
			},
		});
	}
}

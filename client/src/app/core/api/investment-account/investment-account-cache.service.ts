import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import {
	GetInvestmentAccountsDocument,
	GetInvestmentAccountsQuery,
	GetTransactionHistoryDocument,
	GetTransactionHistoryQuery,
	InvestmentAccountFragment,
	InvestmentAccountFragmentDoc,
	InvestmentAccountOverviewFragment,
	InvestmentAccountTransactionOutputFragment,
} from '../../graphql';

@Injectable({
	providedIn: 'root',
})
export class InvestmentAccountCacheService {
	constructor(private apollo: Apollo) {}

	getInvestmentAccountsFromCache(): InvestmentAccountOverviewFragment[] | undefined {
		const query = this.apollo.client.readQuery<GetInvestmentAccountsQuery>({
			query: GetInvestmentAccountsDocument,
		});

		return query?.getInvestmentAccounts;
	}

	updateInvestmentAccountsList(data: InvestmentAccountOverviewFragment[]): void {
		return this.apollo.client.writeQuery<GetInvestmentAccountsQuery>({
			query: GetInvestmentAccountsDocument,
			data: {
				__typename: 'Query',
				getInvestmentAccounts: [...data],
			},
		});
	}

	getInvestmentAccountFromCache(accountId: string): InvestmentAccountFragment {
		const fragment = this.apollo.client.readFragment<InvestmentAccountFragment>({
			id: `InvestmentAccount:${accountId}`,
			fragmentName: 'InvestmentAccount',
			fragment: InvestmentAccountFragmentDoc,
		});

		// not found
		if (!fragment) {
			throw new Error(`[InvestmentAccountApiService]: Unable to find InvestmentAccountFragment`);
		}

		return fragment;
	}

	updateInvestmentAccount(data: InvestmentAccountFragment): void {
		this.apollo.client.writeFragment<InvestmentAccountOverviewFragment>({
			id: `InvestmentAccount:${data.id}`,
			fragmentName: 'InvestmentAccount',
			fragment: InvestmentAccountFragmentDoc,
			data: {
				...data,
			},
		});
	}

	getTransactionHistory(accountId: string): InvestmentAccountTransactionOutputFragment[] | undefined {
		const query = this.apollo.client.readQuery<GetTransactionHistoryQuery>({
			query: GetTransactionHistoryDocument,
			variables: {
				accountId,
			},
		});

		return query?.getTransactionHistory;
	}

	updateTransactionHistory(accountId: string, transaction: InvestmentAccountTransactionOutputFragment[]): void {
		this.apollo.client.writeQuery<GetTransactionHistoryQuery>({
			query: GetTransactionHistoryDocument,
			variables: {
				accountId,
			},
			data: {
				__typename: 'Query',
				getTransactionHistory: [...transaction],
			},
		});
	}
}

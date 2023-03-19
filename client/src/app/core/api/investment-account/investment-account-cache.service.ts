import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import {
	GetInvestmentAccountByUserDocument,
	GetInvestmentAccountByUserQuery,
	GetTransactionHistoryDocument,
	GetTransactionHistoryQuery,
	InvestmentAccountDetailsFragment,
	InvestmentAccountTransactionOutputFragment,
} from '../../graphql';

@Injectable({
	providedIn: 'root',
})
export class InvestmentAccountCacheService {
	constructor(private apollo: Apollo) {}

	getInvestmentAccountDetails(): InvestmentAccountDetailsFragment {
		const fragment = this.apollo.client.readQuery<GetInvestmentAccountByUserQuery>({
			query: GetInvestmentAccountByUserDocument,
		});

		// not found
		if (!fragment?.getInvestmentAccountByUser) {
			throw new Error(`[InvestmentAccountApiService]: Unable to find InvestmentAccountDetailsFragment`);
		}

		return fragment.getInvestmentAccountByUser;
	}

	updateInvestmentAccountDetails(data: InvestmentAccountDetailsFragment): void {
		this.apollo.client.writeQuery<GetInvestmentAccountByUserQuery>({
			query: GetInvestmentAccountByUserDocument,
			data: {
				__typename: 'Query',
				getInvestmentAccountByUser: {
					...data,
				},
			},
		});
	}

	getTransactionHistory(): InvestmentAccountTransactionOutputFragment[] | undefined {
		const query = this.apollo.client.readQuery<GetTransactionHistoryQuery>({
			query: GetTransactionHistoryDocument,
		});

		return query?.getTransactionHistory;
	}

	updateTransactionHistory(transaction: InvestmentAccountTransactionOutputFragment[]): void {
		this.apollo.client.writeQuery<GetTransactionHistoryQuery>({
			query: GetTransactionHistoryDocument,
			data: {
				__typename: 'Query',
				getTransactionHistory: [...transaction],
			},
		});
	}
}

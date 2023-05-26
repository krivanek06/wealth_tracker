import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import {
	GetInvestmentAccountByUserDocument,
	GetInvestmentAccountByUserQuery,
	GetInvestmentAccountGrowthDocument,
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
		const query = this.apollo.client.readQuery<GetInvestmentAccountByUserQuery>({
			query: GetInvestmentAccountByUserDocument,
		});

		// not found
		if (!query?.getInvestmentAccountByUser) {
			throw new Error(`[InvestmentAccountApiService]: Unable to find InvestmentAccountDetailsFragment`);
		}

		return query.getInvestmentAccountByUser;
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
			variables: {
				input: {},
			},
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
			variables: {
				input: {},
			},
		});
	}

	refetchInvestmentAccountGrowth(): void {
		this.apollo.client.refetchQueries({
			include: [GetInvestmentAccountGrowthDocument],
		});
	}
}

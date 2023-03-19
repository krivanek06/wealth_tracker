import { Injectable } from '@angular/core';
import { DataProxy, FetchResult } from '@apollo/client/core';
import { Apollo } from 'apollo-angular';
import { map, Observable } from 'rxjs';
import {
	AccountType,
	CreateInvestmentAccountGQL,
	CreateInvestmentAccountMutation,
	DeleteInvestmentAccountGQL,
	DeleteInvestmentAccountMutation,
	EditInvestmentAccountGQL,
	EditInvestmentAccountMutation,
	GetInvestmentAccountByUserGQL,
	GetInvestmentAccountGrowthGQL,
	GetTransactionHistoryGQL,
	GetTransactionSymbolsGQL,
	InvestmentAccountDetailsFragment,
	InvestmentAccountEditInput,
	InvestmentAccountGrowth,
	InvestmentAccountTransactionOutput,
} from '../../graphql';
import { AccountManagerCacheService } from '../account-manager';

@Injectable({
	providedIn: 'root',
})
export class InvestmentAccountApiService {
	constructor(
		private getInvestmentAccountByUserGQL: GetInvestmentAccountByUserGQL,
		private getInvestmentAccountGrowthGQL: GetInvestmentAccountGrowthGQL,
		private createInvestmentAccountGQL: CreateInvestmentAccountGQL,
		private editInvestmentAccountGQL: EditInvestmentAccountGQL,
		private deleteInvestmentAccountGQL: DeleteInvestmentAccountGQL,
		private getTransactionHistoryGQL: GetTransactionHistoryGQL,
		private getTransactionSymbolsGQL: GetTransactionSymbolsGQL,
		private accountManagerCacheService: AccountManagerCacheService,
		private apollo: Apollo
	) {}

	getInvestmentAccountByUser(): Observable<InvestmentAccountDetailsFragment | undefined | null> {
		return this.getInvestmentAccountByUserGQL
			.watch()
			.valueChanges.pipe(map((res) => res.data.getInvestmentAccountByUser));
	}

	getInvestmentAccountGrowth(): Observable<InvestmentAccountGrowth[]> {
		return this.getInvestmentAccountGrowthGQL
			.watch({
				input: {
					sectors: [],
				},
			})
			.valueChanges.pipe(map((res) => res.data.getInvestmentAccountGrowth));
	}

	getTransactionHistory(): Observable<InvestmentAccountTransactionOutput[]> {
		return this.getTransactionHistoryGQL.watch().valueChanges.pipe(map((res) => res.data.getTransactionHistory));
	}

	getAvailableTransactionSymbols(): Observable<string[]> {
		return this.getTransactionSymbolsGQL.watch().valueChanges.pipe(map((res) => res.data.getTransactionSymbols));
	}

	createInvestmentAccount(name: string): Observable<FetchResult<CreateInvestmentAccountMutation>> {
		return this.createInvestmentAccountGQL.mutate(
			{
				input: {
					name,
				},
			},
			{
				update: (store: DataProxy, { data }) => {
					const result = data?.createInvestmentAccount;

					if (!result) {
						return;
					}

					// update cache
					this.accountManagerCacheService.createAccountType(result);
				},
			}
		);
	}

	editInvestmentAccount(input: InvestmentAccountEditInput): Observable<FetchResult<EditInvestmentAccountMutation>> {
		return this.editInvestmentAccountGQL.mutate({
			input,
		});
	}

	deleteInvestmentAccount(): Observable<FetchResult<DeleteInvestmentAccountMutation>> {
		return this.deleteInvestmentAccountGQL.mutate(
			{},
			{
				update: (store: DataProxy, { data }) => {
					const result = data?.deleteInvestmentAccount;

					if (!result) {
						return;
					}

					// update cache
					this.accountManagerCacheService.removeAccountType(AccountType.Investment);

					// remove from cache
					this.apollo.client.cache.evict({ id: `${data?.__typename}:${data?.deleteInvestmentAccount.id}` });
					this.apollo.client.cache.gc();
				},
			}
		);
	}
}

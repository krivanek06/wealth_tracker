import { Injectable } from '@angular/core';
import { DataProxy, FetchResult } from '@apollo/client/core';
import { Apollo } from 'apollo-angular';
import { map, Observable } from 'rxjs';
import {
	CreateInvestmentAccountGQL,
	CreateInvestmentAccountMutation,
	DeleteInvestmentAccountGQL,
	DeleteInvestmentAccountMutation,
	EditInvestmentAccountGQL,
	EditInvestmentAccountMutation,
	GetInvestmentAccountByIdGQL,
	GetInvestmentAccountGrowthGQL,
	GetInvestmentAccountsGQL,
	GetTransactionHistoryGQL,
	GetTransactionSymbolsGQL,
	InvestmentAccountEditInput,
	InvestmentAccountFragment,
	InvestmentAccountGrowth,
	InvestmentAccountOverviewFragment,
	InvestmentAccountTransactionOutput,
} from '../../graphql';
import { InvestmentAccountCacheService } from './investment-account-cache.service';

@Injectable({
	providedIn: 'root',
})
export class InvestmentAccountApiService {
	constructor(
		private getInvestmentAccountsGQL: GetInvestmentAccountsGQL,
		private getInvestmentAccountByIdGQL: GetInvestmentAccountByIdGQL,
		private getInvestmentAccountGrowthGQL: GetInvestmentAccountGrowthGQL,
		private createInvestmentAccountGQL: CreateInvestmentAccountGQL,
		private editInvestmentAccountGQL: EditInvestmentAccountGQL,
		private deleteInvestmentAccountGQL: DeleteInvestmentAccountGQL,
		private getTransactionHistoryGQL: GetTransactionHistoryGQL,
		private getTransactionSymbolsGQL: GetTransactionSymbolsGQL,
		private investmentAccountCacheService: InvestmentAccountCacheService,
		private apollo: Apollo
	) {}

	getInvestmentAccounts(): Observable<InvestmentAccountOverviewFragment[]> {
		return this.getInvestmentAccountsGQL.watch().valueChanges.pipe(map((res) => res.data.getInvestmentAccounts));
	}

	getInvestmentAccountById(accountId: string): Observable<InvestmentAccountFragment> {
		return this.getInvestmentAccountByIdGQL
			.watch({
				input: accountId,
			})
			.valueChanges.pipe(map((res) => res.data.getInvestmentAccountById));
	}

	getInvestmentAccountGrowth(investmenAccountId: string): Observable<InvestmentAccountGrowth[]> {
		return this.getInvestmentAccountGrowthGQL
			.watch({
				input: {
					investmenAccountId,
					sectors: [],
				},
			})
			.valueChanges.pipe(map((res) => res.data.getInvestmentAccountGrowth));
	}

	getTransactionHistory(accountId: string): Observable<InvestmentAccountTransactionOutput[]> {
		return this.getTransactionHistoryGQL
			.watch({
				accountId,
			})
			.valueChanges.pipe(map((res) => res.data.getTransactionHistory));
	}

	getAvailableTransactionSymbols(input: string): Observable<string[]> {
		return this.getTransactionSymbolsGQL
			.watch({
				input,
			})
			.valueChanges.pipe(map((res) => res.data.getTransactionSymbols));
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
					const result = data?.createInvestmentAccount as InvestmentAccountOverviewFragment;

					// load accounts from cache
					const accounts = this.investmentAccountCacheService.getInvestmentAccountsFromCache() ?? [];

					// update cache
					this.investmentAccountCacheService.updateInvestmentAccountsList([...accounts, result]);
				},
			}
		);
	}

	editInvestmentAccount(input: InvestmentAccountEditInput): Observable<FetchResult<EditInvestmentAccountMutation>> {
		return this.editInvestmentAccountGQL.mutate({
			input,
		});
	}

	deleteInvestmentAccount(accountId: string): Observable<FetchResult<DeleteInvestmentAccountMutation>> {
		return this.deleteInvestmentAccountGQL.mutate(
			{
				input: accountId,
			},
			{
				update: (store: DataProxy, { data }) => {
					// load accounts from cache
					const accounts = this.investmentAccountCacheService.getInvestmentAccountsFromCache() ?? [];
					const updatedAccounts = accounts.filter((d) => d.id !== accountId);

					// update cache
					this.investmentAccountCacheService.updateInvestmentAccountsList([...updatedAccounts]);

					// remove from cache
					this.apollo.client.cache.evict({ id: `${data?.__typename}:${accountId}` });
					this.apollo.client.cache.gc();
				},
			}
		);
	}
}

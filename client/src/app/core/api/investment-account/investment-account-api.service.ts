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
	GetInvestmentAccountByUserGQL,
	GetInvestmentAccountGrowthGQL,
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
		private getInvestmentAccountByUserGQL: GetInvestmentAccountByUserGQL,
		private getInvestmentAccountGrowthGQL: GetInvestmentAccountGrowthGQL,
		private createInvestmentAccountGQL: CreateInvestmentAccountGQL,
		private editInvestmentAccountGQL: EditInvestmentAccountGQL,
		private deleteInvestmentAccountGQL: DeleteInvestmentAccountGQL,
		private getTransactionHistoryGQL: GetTransactionHistoryGQL,
		private getTransactionSymbolsGQL: GetTransactionSymbolsGQL,
		private investmentAccountCacheService: InvestmentAccountCacheService,
		private apollo: Apollo
	) {}

	getInvestmentAccountByUser(): Observable<InvestmentAccountFragment | undefined | null> {
		return this.getInvestmentAccountByUserGQL
			.watch()
			.valueChanges.pipe(map((res) => res.data.getInvestmentAccountByUser));
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

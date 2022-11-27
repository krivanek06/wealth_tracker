import { Injectable } from '@angular/core';
import { DataProxy, FetchResult } from '@apollo/client/core';
import { map, Observable } from 'rxjs';
import {
	CreateInvestmentAccountGQL,
	CreateInvestmentAccountHoldingGQL,
	CreateInvestmentAccountHoldingMutation,
	DeleteInvestmentAccountGQL,
	DeleteInvestmentAccountHoldingGQL,
	DeleteInvestmentAccountHoldingMutation,
	EditInvestmentAccountGQL,
	GetInvestmentAccountByIdGQL,
	GetInvestmentAccountGrowthGQL,
	GetInvestmentAccountsGQL,
	GetTransactionHistoryGQL,
	GetTransactionSymbolsGQL,
	InvestmentAccounHoldingCreateInput,
	InvestmentAccounHoldingHistoryDeleteInput,
	InvestmentAccountActiveHoldingOutput,
	InvestmentAccountFragment,
	InvestmentAccountGrowth,
	InvestmentAccountHoldingHistoryFragment,
	InvestmentAccountHoldingHistoryType,
	InvestmentAccountOverviewFragment,
	InvestmentAccountTransactionInput,
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
		private createInvestmentAccountHoldingGQL: CreateInvestmentAccountHoldingGQL,
		private deleteInvestmentAccountHoldingGQL: DeleteInvestmentAccountHoldingGQL,

		private getTransactionHistoryGQL: GetTransactionHistoryGQL,
		private getTransactionSymbolsGQL: GetTransactionSymbolsGQL,
		private investmentAccountCacheService: InvestmentAccountCacheService
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

	getTransactionHistory(input: InvestmentAccountTransactionInput): Observable<InvestmentAccountTransactionOutput[]> {
		return this.getTransactionHistoryGQL
			.fetch(
				{
					input,
				},
				{
					fetchPolicy: 'network-only',
				}
			)
			.pipe(map((res) => res.data.getTransactionHistory));
	}

	getAvailableTransactionSymbols(input: string): Observable<string[]> {
		return this.getTransactionSymbolsGQL
			.watch({
				input,
			})
			.valueChanges.pipe(map((res) => res.data.getTransactionSymbols));
	}

	createInvestmentAccountHolding(
		input: InvestmentAccounHoldingCreateInput
	): Observable<FetchResult<CreateInvestmentAccountHoldingMutation>> {
		return this.createInvestmentAccountHoldingGQL.mutate(
			{
				input,
			},
			{
				update: (store: DataProxy, { data }) => {
					const result = data?.createInvestmentAccountHolding as InvestmentAccountActiveHoldingOutput;
					const account = this.investmentAccountCacheService.getInvestmentAccountFromCache(input.investmentAccountId);
					const holdingIndex = account.activeHoldings.findIndex((d) => d.assetId === result.assetId);

					// if sell I may reduce or completely sell every holding
					if (input.type === InvestmentAccountHoldingHistoryType.Sell) {
						const activeHoldings =
							result.units !== 0
								? account.activeHoldings.map((d) => (d.assetId === result.assetId ? result : d))
								: account.activeHoldings.filter((d) => d.id !== result.id);
						this.investmentAccountCacheService.updateInvestmentAccount({ ...account, activeHoldings });
					}

					// if buy then symbol may or may not be in my active holdings
					if (input.type === InvestmentAccountHoldingHistoryType.Buy) {
						const activeHoldings =
							holdingIndex > -1
								? account.activeHoldings.map((d) => (d.assetId === result.assetId ? result : d))
								: [...account.activeHoldings, result];
						this.investmentAccountCacheService.updateInvestmentAccount({ ...account, activeHoldings });
					}
				},
			}
		);
	}

	deleteInvestmentAccountHolding(
		input: InvestmentAccounHoldingHistoryDeleteInput
	): Observable<FetchResult<DeleteInvestmentAccountHoldingMutation>> {
		return this.deleteInvestmentAccountHoldingGQL.mutate(
			{
				input,
			},
			{
				update: (store: DataProxy, { data }) => {
					const result = data?.deleteInvestmentAccountHolding as InvestmentAccountHoldingHistoryFragment;
					const account = this.investmentAccountCacheService.getInvestmentAccountFromCache(input.investmentAccountId);

					// remove cashChangeId from cashChange
					const cashChange = account.cashChange.filter((d) => d.itemId !== result.cashChangeId);

					this.investmentAccountCacheService.updateInvestmentAccount({ ...account, cashChange });
				},
			}
		);
	}
}

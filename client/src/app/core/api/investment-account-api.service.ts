import { Injectable } from '@angular/core';
import { DataProxy, FetchResult } from '@apollo/client/core';
import { Apollo } from 'apollo-angular';
import { map, Observable } from 'rxjs';
import {
	CreateInvestmentAccountCasheGQL,
	CreateInvestmentAccountCasheMutation,
	CreateInvestmentAccountGQL,
	CreateInvestmentAccountHoldingGQL,
	DeleteInvestmentAccountCasheGQL,
	DeleteInvestmentAccountCasheMutation,
	DeleteInvestmentAccountGQL,
	DeleteInvestmentAccountHoldingGQL,
	EditInvestmentAccountGQL,
	GetInvestmentAccountByIdGQL,
	GetInvestmentAccountGrowthGQL,
	GetInvestmentAccountsGQL,
	GetTransactionHistoryGQL,
	GetTransactionSymbolsGQL,
	InvestmentAccountCashChangeFragment,
	InvestmentAccountCashCreateInput,
	InvestmentAccountCashDeleteInput,
	InvestmentAccountFragment,
	InvestmentAccountFragmentDoc,
	InvestmentAccountGrowth,
	InvestmentAccountOverviewFragment,
	InvestmentAccountTransactionInput,
	InvestmentAccountTransactionOutput,
} from '../graphql';

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
		private createInvestmentAccountCasheGQL: CreateInvestmentAccountCasheGQL,
		//private editInvestmentAccountCashe: EditInvestmentAccountCasheGQL, // user rather create & delete
		private deleteInvestmentAccountCasheGQL: DeleteInvestmentAccountCasheGQL,
		private getTransactionHistoryGQL: GetTransactionHistoryGQL,
		private getTransactionSymbolsGQL: GetTransactionSymbolsGQL,
		private apollo: Apollo
	) {}

	getInvestmentAccountFromCachce(accountId: string): InvestmentAccountFragment {
		const fragment = this.apollo.client.readFragment<InvestmentAccountFragment>({
			id: `InvestmentAccount:${accountId}`,
			fragmentName: 'InvestmentAccount',
			fragment: InvestmentAccountFragmentDoc,
		});

		// not found
		if (!fragment) {
			throw new Error(`[InvestmentAccountApiService]: Unable to find the correct invetment account`);
		}

		return fragment;
	}

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

	// TODO: when BUY new holding - add transaction into the array so that I can select the symbol
	getAvailableTransactionSymbols(input: string): Observable<string[]> {
		return this.getTransactionSymbolsGQL
			.watch({
				input,
			})
			.valueChanges.pipe(map((res) => res.data.getTransactionSymbols));
	}

	createInvestmentAccountCashe(
		input: InvestmentAccountCashCreateInput
	): Observable<FetchResult<CreateInvestmentAccountCasheMutation>> {
		return this.createInvestmentAccountCasheGQL.mutate(
			{
				input,
			},
			{
				optimisticResponse: {
					__typename: 'Mutation',
					createInvestmentAccountCashe: {
						__typename: 'InvestmentAccountCashChange',
						cashValue: input.cashValue,
						itemId: new Date().toTimeString(),
						date: input.date,
						type: input.type,
					},
				},
				update: (store: DataProxy, { data }) => {
					const result = data?.createInvestmentAccountCashe as InvestmentAccountCashChangeFragment;
					const account = this.getInvestmentAccountFromCachce(input.investmentAccountId);
					const cashChange = [...account.cashChange, result].sort((a, b) => (a.date < b.date ? -1 : 1));

					this.updateInvestmentAccount({ ...account, cashChange });
				},
			}
		);
	}

	deleteInvestmentAccountCashe(
		input: InvestmentAccountCashDeleteInput,
		removingItem: InvestmentAccountCashChangeFragment
	): Observable<FetchResult<DeleteInvestmentAccountCasheMutation>> {
		return this.deleteInvestmentAccountCasheGQL.mutate(
			{
				input,
			},
			{
				optimisticResponse: {
					__typename: 'Mutation',
					deleteInvestmentAccountCashe: {
						__typename: 'InvestmentAccountCashChange',
						itemId: removingItem.itemId,
						cashValue: removingItem.cashValue,
						date: removingItem.date,
						type: removingItem.type,
					},
				},
				update: (store: DataProxy, { data }) => {
					const result = data?.deleteInvestmentAccountCashe as InvestmentAccountCashChangeFragment;
					const account = this.getInvestmentAccountFromCachce(input.investmentAccountId);
					const cashChange = account.cashChange.filter((d) => d.itemId !== result.itemId);

					this.updateInvestmentAccount({ ...account, cashChange });
				},
			}
		);
	}

	private updateInvestmentAccount(data: InvestmentAccountFragment): void {
		this.apollo.client.writeFragment<InvestmentAccountOverviewFragment>({
			id: `InvestmentAccount:${data.id}`,
			fragmentName: 'InvestmentAccount',
			fragment: InvestmentAccountFragmentDoc,
			data: {
				...data,
			},
		});
	}
}

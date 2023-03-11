import { Injectable } from '@angular/core';
import { DataProxy, FetchResult } from '@apollo/client/core';
import { map, Observable, tap } from 'rxjs';
import {
	CashModificationSubscriptionGQL,
	CreateInvestmentAccountCasheGQL,
	CreateInvestmentAccountCasheMutation,
	Data_Modification,
	DeleteInvestmentAccountCasheGQL,
	DeleteInvestmentAccountCasheMutation,
	InvestmentAccountCashChangeFragment,
	InvestmentAccountCashChangeSubscription,
	InvestmentAccountCashCreateInput,
	InvestmentAccountCashDeleteInput,
} from '../../graphql';
import { InvestmentAccountCacheService } from './investment-account-cache.service';

@Injectable({
	providedIn: 'root',
})
export class InvestmentAccountCashApiService {
	constructor(
		private createInvestmentAccountCasheGQL: CreateInvestmentAccountCasheGQL,
		private deleteInvestmentAccountCasheGQL: DeleteInvestmentAccountCasheGQL,
		private cashModificationSubscriptionGQL: CashModificationSubscriptionGQL,
		private investmentAccountCacheService: InvestmentAccountCacheService
	) {
		this.cashModificationSubscription().subscribe();
	}

	createInvestmentAccountCash(
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
						imageUrl: '',
					},
				},
				update: (store: DataProxy, { data }) => {
					const result = data?.createInvestmentAccountCashe as InvestmentAccountCashChangeFragment;
					this.addCashFromCache(input.investmentAccountId, result);
				},
			}
		);
	}

	deleteInvestmentAccountCash(
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
						imageUrl: '',
					},
				},
				update: (store: DataProxy, { data }) => {
					const result = data?.deleteInvestmentAccountCashe as InvestmentAccountCashChangeFragment;
					this.removeCashFromCache(input.investmentAccountId, result);
				},
			}
		);
	}

	cashModificationSubscription(): Observable<InvestmentAccountCashChangeSubscription | undefined> {
		return this.cashModificationSubscriptionGQL.subscribe().pipe(
			map((res) => res.data?.cashModification),
			tap((result) => {
				if (!result) {
					return;
				}

				if (result.modification === Data_Modification.Removed) {
					this.removeCashFromCache(result.accountId, result.data);
				} else if (result.modification === Data_Modification.Created) {
					this.addCashFromCache(result.accountId, result.data);
				}

				console.log('createdCashSubscription', result);
			})
		);
	}

	private addCashFromCache(investmentAccountId: string, result: InvestmentAccountCashChangeFragment): void {
		const account = this.investmentAccountCacheService.getInvestmentAccountFromCache(investmentAccountId);
		const isExists = account.cashChange.find((d) => d.itemId === result.itemId);

		// update cash only if doesn't exists
		if (!isExists) {
			const cashChange = [...account.cashChange, result].sort((a, b) => (a.date < b.date ? -1 : 1));
			this.investmentAccountCacheService.updateInvestmentAccount({ ...account, cashChange });
		}
	}

	private removeCashFromCache(investmentAccountId: string, result: InvestmentAccountCashChangeFragment): void {
		const account = this.investmentAccountCacheService.getInvestmentAccountFromCache(investmentAccountId);
		const isExists = account.cashChange.find((d) => d.itemId === result.itemId);

		// update cash only if exists
		if (!!isExists) {
			const cashChange = account.cashChange.filter((d) => d.itemId !== result.itemId);
			this.investmentAccountCacheService.updateInvestmentAccount({ ...account, cashChange });
		}
	}
}

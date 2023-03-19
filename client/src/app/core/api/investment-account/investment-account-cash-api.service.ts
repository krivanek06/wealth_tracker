import { Injectable } from '@angular/core';
import { DataProxy, FetchResult } from '@apollo/client/core';
import { Observable } from 'rxjs';
import {
	CreateInvestmentAccountCashGQL,
	CreateInvestmentAccountCashMutation,
	DeleteInvestmentAccountCashGQL,
	DeleteInvestmentAccountCashMutation,
	InvestmentAccountCashChangeFragment,
	InvestmentAccountCashCreateInput,
	InvestmentAccountCashDeleteInput,
} from '../../graphql';
import { InvestmentAccountCacheService } from './investment-account-cache.service';

@Injectable({
	providedIn: 'root',
})
export class InvestmentAccountCashApiService {
	constructor(
		private createInvestmentAccountCashGQL: CreateInvestmentAccountCashGQL,
		private deleteInvestmentAccountCashGQL: DeleteInvestmentAccountCashGQL,
		private investmentAccountCacheService: InvestmentAccountCacheService
	) {}

	createInvestmentAccountCash(
		input: InvestmentAccountCashCreateInput
	): Observable<FetchResult<CreateInvestmentAccountCashMutation>> {
		return this.createInvestmentAccountCashGQL.mutate(
			{
				input,
			},
			{
				optimisticResponse: {
					__typename: 'Mutation',
					createInvestmentAccountCash: {
						__typename: 'InvestmentAccountCashChange',
						cashValue: input.cashValue,
						itemId: new Date().toTimeString(),
						date: input.date,
						type: input.type,
						imageUrl: '',
					},
				},
				update: (store: DataProxy, { data }) => {
					const result = data?.createInvestmentAccountCash as InvestmentAccountCashChangeFragment;

					// add cash entry to the array of entries
					this.addCashToCache(result);
				},
			}
		);
	}

	deleteInvestmentAccountCash(
		input: InvestmentAccountCashDeleteInput,
		removingItem: InvestmentAccountCashChangeFragment
	): Observable<FetchResult<DeleteInvestmentAccountCashMutation>> {
		return this.deleteInvestmentAccountCashGQL.mutate(
			{
				input,
			},
			{
				optimisticResponse: {
					__typename: 'Mutation',
					deleteInvestmentAccountCash: {
						__typename: 'InvestmentAccountCashChange',
						itemId: removingItem.itemId,
						cashValue: removingItem.cashValue,
						date: removingItem.date,
						type: removingItem.type,
						imageUrl: '',
					},
				},
				update: (store: DataProxy, { data }) => {
					const result = data?.deleteInvestmentAccountCash as InvestmentAccountCashChangeFragment;
					this.removeCashFromCache(result);
				},
			}
		);
	}

	private addCashToCache(result: InvestmentAccountCashChangeFragment): void {
		const account = this.investmentAccountCacheService.getInvestmentAccountDetails();

		// update cash only if doesn't exists
		const cashChange = [...account.cashChange, result].sort((a, b) => (a.date < b.date ? -1 : 1));
		this.investmentAccountCacheService.updateInvestmentAccountDetails({ ...account, cashChange });
	}

	private removeCashFromCache(result: InvestmentAccountCashChangeFragment): void {
		const account = this.investmentAccountCacheService.getInvestmentAccountDetails();

		// update cash only if exists
		const cashChange = account.cashChange.filter((d) => d.itemId !== result.itemId);
		this.investmentAccountCacheService.updateInvestmentAccountDetails({ ...account, cashChange });
	}
}

import { Injectable } from '@angular/core';
import { DataProxy, FetchResult } from '@apollo/client/core';
import { Observable } from 'rxjs';
import {
	CreateInvestmentAccountHoldingGQL,
	CreateInvestmentAccountHoldingMutation,
	DeleteInvestmentAccountHoldingGQL,
	DeleteInvestmentAccountHoldingMutation,
	InvestmentAccounHoldingCreateInput,
	InvestmentAccountActiveHoldingOutputWrapper,
	InvestmentAccountHoldingHistoryFragment,
	InvestmentAccountHoldingHistoryType,
	InvestmentAccountTransactionOutput,
} from '../../graphql';
import { InvestmentAccountCacheService } from './investment-account-cache.service';

@Injectable({
	providedIn: 'root',
})
export class InvestmentAccountHoldingService {
	constructor(
		private createInvestmentAccountHoldingGQL: CreateInvestmentAccountHoldingGQL,
		private deleteInvestmentAccountHoldingGQL: DeleteInvestmentAccountHoldingGQL,
		private investmentAccountCacheService: InvestmentAccountCacheService
	) {}

	createInvestmentAccountHolding(
		input: InvestmentAccounHoldingCreateInput
	): Observable<FetchResult<CreateInvestmentAccountHoldingMutation>> {
		return this.createInvestmentAccountHoldingGQL.mutate(
			{
				input,
			},
			{
				update: (store: DataProxy, { data }) => {
					const result = data?.createInvestmentAccountHolding as InvestmentAccountActiveHoldingOutputWrapper;
					const { holdingOutput, transaction } = result;

					const accountId = input.investmentAccountId;
					const account = this.investmentAccountCacheService.getInvestmentAccountFromCache(accountId);
					const holdingIndex = account.activeHoldings.findIndex((d) => d.assetId === holdingOutput.assetId);

					// if sell I may reduce or completely sell every holding
					if (input.type === InvestmentAccountHoldingHistoryType.Sell) {
						const activeHoldings =
							holdingOutput.units !== 0
								? account.activeHoldings.map((d) => (d.assetId === holdingOutput.assetId ? holdingOutput : d))
								: account.activeHoldings.filter((d) => d.id !== holdingOutput.id);
						this.investmentAccountCacheService.updateInvestmentAccount({ ...account, activeHoldings });
					}

					// if buy then symbol may or may not be in my active holdings
					else if (input.type === InvestmentAccountHoldingHistoryType.Buy) {
						const activeHoldings =
							holdingIndex > -1
								? account.activeHoldings.map((d) => (d.assetId === holdingOutput.assetId ? holdingOutput : d))
								: [...account.activeHoldings, holdingOutput];
						this.investmentAccountCacheService.updateInvestmentAccount({ ...account, activeHoldings });
					}

					// update transaction history
					const cachedTransactionHistory = this.investmentAccountCacheService.getTransactionHistory(accountId);
					if (cachedTransactionHistory) {
						this.investmentAccountCacheService.updateTransactionHistory(accountId, [
							...cachedTransactionHistory,
							transaction,
						]);
					}
				},
			}
		);
	}

	deleteInvestmentAccountHolding(
		accountId: string,
		history: InvestmentAccountTransactionOutput
	): Observable<FetchResult<DeleteInvestmentAccountHoldingMutation>> {
		return this.deleteInvestmentAccountHoldingGQL.mutate(
			{
				input: {
					investmentAccountId: accountId,
					itemId: history.itemId,
					symbol: history.assetId,
				},
			},
			{
				optimisticResponse: {
					__typename: 'Mutation',
					deleteInvestmentAccountHolding: {
						__typename: 'InvestmentAccountHoldingHistory',
						date: history.date,
						cashChangeId: history.cashChangeId,
						itemId: history.itemId,
						type: history.type,
						units: history.units,
						unitValue: history.unitValue,
						return: history.return,
						returnChange: history.returnChange,
					},
				},
				update: (store: DataProxy, { data }) => {
					const result = data?.deleteInvestmentAccountHolding as InvestmentAccountHoldingHistoryFragment;
					const account = this.investmentAccountCacheService.getInvestmentAccountFromCache(accountId);

					// remove cashChangeId from cashChange
					const cashChange = account.cashChange.filter((d) => d.itemId !== result.cashChangeId);
					// update units for active holding if exists
					const activeHoldings = account.activeHoldings.map((d) =>
						d.assetId === history.assetId
							? {
									...d,
									units:
										d.units +
										(history.type === InvestmentAccountHoldingHistoryType.Buy ? -history.units : history.units),
							  }
							: d
					);
					// save update in cache
					this.investmentAccountCacheService.updateInvestmentAccount({ ...account, cashChange, activeHoldings });

					// update transaction history
					const cachedTransactionHistory = this.investmentAccountCacheService.getTransactionHistory(accountId);
					if (cachedTransactionHistory) {
						const filteredHistory = cachedTransactionHistory.filter((d) => d.itemId !== result.itemId);
						this.investmentAccountCacheService.updateTransactionHistory(accountId, filteredHistory);
					}
				},
			}
		);
	}
}

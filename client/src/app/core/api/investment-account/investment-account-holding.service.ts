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

					const account = this.investmentAccountCacheService.getInvestmentAccountDetails();
					const holdingIndex = account.activeHoldings.findIndex((d) => d.assetId === holdingOutput.assetId);

					if (input.type === InvestmentAccountHoldingHistoryType.Sell) {
						// if sell I may reduce or completely sell every holding
						const activeHoldings =
							holdingOutput.units !== 0
								? account.activeHoldings.map((d) => (d.assetId === holdingOutput.assetId ? holdingOutput : d))
								: account.activeHoldings.filter((d) => d.id !== holdingOutput.id);
						this.investmentAccountCacheService.updateInvestmentAccountDetails({ ...account, activeHoldings });
					} else {
						// if buy then symbol may or may not be in my active holdings
						const activeHoldings =
							holdingIndex > -1
								? account.activeHoldings.map((d) => (d.assetId === holdingOutput.assetId ? holdingOutput : d))
								: [...account.activeHoldings, holdingOutput];
						this.investmentAccountCacheService.updateInvestmentAccountDetails({ ...account, activeHoldings });
					}

					// update transaction history
					const cachedTransactionHistory = this.investmentAccountCacheService.getTransactionHistory();
					if (cachedTransactionHistory) {
						this.investmentAccountCacheService.updateTransactionHistory([...cachedTransactionHistory, transaction]);
					}

					// reload investment account growth query for updated data
					this.investmentAccountCacheService.refetchInvestmentAccountGrowth();
				},
			}
		);
	}

	deleteInvestmentAccountHolding(
		history: InvestmentAccountTransactionOutput
	): Observable<FetchResult<DeleteInvestmentAccountHoldingMutation>> {
		return this.deleteInvestmentAccountHoldingGQL.mutate(
			{
				input: {
					itemId: history.itemId,
					symbol: history.assetId,
				},
			},
			{
				update: (store: DataProxy, { data }) => {
					const result = data?.deleteInvestmentAccountHolding as InvestmentAccountHoldingHistoryFragment;
					const account = this.investmentAccountCacheService.getInvestmentAccountDetails();

					// update units for active holding if exists
					const activeHoldings = account.activeHoldings
						.map((d) =>
							d.assetId === history.assetId
								? {
										...d,
										units:
											d.units +
											(history.type === InvestmentAccountHoldingHistoryType.Buy ? -history.units : history.units),
								  }
								: d
						)
						.filter((d) => d.units !== 0);

					// save update in cache
					this.investmentAccountCacheService.updateInvestmentAccountDetails({ ...account, activeHoldings });

					// update transaction history
					const cachedTransactionHistory = this.investmentAccountCacheService.getTransactionHistory();
					if (cachedTransactionHistory) {
						const filteredHistory = cachedTransactionHistory.filter((d) => d.itemId !== result.itemId);
						this.investmentAccountCacheService.updateTransactionHistory(filteredHistory);
					}

					// reload investment account growth query for updated data
					this.investmentAccountCacheService.refetchInvestmentAccountGrowth();
				},
			}
		);
	}
}

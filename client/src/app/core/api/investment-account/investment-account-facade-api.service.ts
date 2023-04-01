import { Injectable } from '@angular/core';
import { FetchResult } from '@apollo/client/core';
import { filter, map, Observable } from 'rxjs';
import {
	ChartSeriesFragment,
	CreateInvestmentAccountHoldingMutation,
	CreateInvestmentAccountMutation,
	DeleteInvestmentAccountHoldingMutation,
	DeleteInvestmentAccountMutation,
	EditInvestmentAccountMutation,
	InvestmentAccounHoldingCreateInput,
	InvestmentAccountCashChangeType,
	InvestmentAccountEditInput,
	InvestmentAccountGrowth,
	InvestmentAccountTransactionOutput,
} from '../../graphql';
import { InvestmentAccountFragmentExtended } from '../../models';
import { InvestmentAccountApiService } from './investment-account-api.service';
import { InvestmentAccountHoldingService } from './investment-account-holding.service';

@Injectable({
	providedIn: 'root',
})
export class InvestmentAccountFacadeApiService {
	constructor(
		private investmentAccountApiService: InvestmentAccountApiService,
		private investmentAccountHoldingService: InvestmentAccountHoldingService
	) {}

	getInvestmentAccountByUser(): Observable<InvestmentAccountFragmentExtended> {
		return this.investmentAccountApiService.getInvestmentAccountByUser().pipe(
			filter((data): data is InvestmentAccountFragmentExtended => !!data),
			map((account) => {
				const currentCash = account.cashChange.reduce((acc, curr) => {
					if (curr.type === InvestmentAccountCashChangeType.Withdrawal) {
						return acc - curr.cashValue;
					}

					return acc + curr.cashValue;
				}, 0);
				const currentInvestments = account.activeHoldings.reduce((acc, curr) => acc + curr.totalValue, 0);
				const currentBalance = currentInvestments + currentCash;

				const assetOperationTotal = account.activeHoldings.reduce(
					(acc, curr) => acc + curr.beakEvenPrice * curr.units,
					0
				);

				// create aggregation for each operation
				const aggregation = account.cashChange.reduce(
					(acc, curr) => {
						return { ...acc, [curr.type]: acc[curr.type] + curr.cashValue };
					},
					{
						ASSET_OPERATION: 0, // don't use
						DEPOSIT: 0,
						WITHDRAWAL: 0,
					} as { [key in InvestmentAccountCashChangeType]: number }
				);

				// create result
				const result: InvestmentAccountFragmentExtended = {
					__typename: account.__typename,
					id: account.id,
					accountType: account.accountType,
					activeHoldings: account.activeHoldings,
					cashChange: account.cashChange,
					name: account.name,
					userId: account.userId,
					createdAt: account.createdAt,
					currentCash,
					currentInvestments,
					currentBalance,
					AssetOperationTotal: assetOperationTotal,
					DepositTotal: aggregation.DEPOSIT,
					WithdrawalTotal: aggregation.WITHDRAWAL,
				};

				return result;
			})
		);
	}

	createInvestmentAccount(): Observable<FetchResult<CreateInvestmentAccountMutation>> {
		return this.investmentAccountApiService.createInvestmentAccount();
	}

	editInvestmentAccount(input: InvestmentAccountEditInput): Observable<FetchResult<EditInvestmentAccountMutation>> {
		return this.investmentAccountApiService.editInvestmentAccount(input);
	}

	deleteInvestmentAccount(): Observable<FetchResult<DeleteInvestmentAccountMutation>> {
		return this.investmentAccountApiService.deleteInvestmentAccount();
	}

	getInvestmentAccountGrowth(): Observable<InvestmentAccountGrowth[]> {
		return this.investmentAccountApiService.getInvestmentAccountGrowth();
	}

	getInvestmentAccountGrowthAssets(): Observable<ChartSeriesFragment[]> {
		return this.investmentAccountApiService.getInvestmentAccountGrowthAssets();
	}

	getTransactionHistory(): Observable<InvestmentAccountTransactionOutput[]> {
		return this.investmentAccountApiService.getTransactionHistory();
	}

	getAvailableTransactionSymbols(): Observable<string[]> {
		return this.investmentAccountApiService.getAvailableTransactionSymbols();
	}

	createInvestmentAccountHolding(
		input: InvestmentAccounHoldingCreateInput
	): Observable<FetchResult<CreateInvestmentAccountHoldingMutation>> {
		return this.investmentAccountHoldingService.createInvestmentAccountHolding(input);
	}

	deleteInvestmentAccountHolding(
		history: InvestmentAccountTransactionOutput
	): Observable<FetchResult<DeleteInvestmentAccountHoldingMutation>> {
		return this.investmentAccountHoldingService.deleteInvestmentAccountHolding(history);
	}
}

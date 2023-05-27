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
				const currentInvestments = account.activeHoldings.reduce((acc, curr) => acc + curr.totalValue, 0);
				const currentBalance = currentInvestments;

				const assetOperationTotal = account.activeHoldings.reduce(
					(acc, curr) => acc + curr.beakEvenPrice * curr.units,
					0
				);

				// create result
				const result: InvestmentAccountFragmentExtended = {
					__typename: account.__typename,
					id: account.id,
					accountType: account.accountType,
					activeHoldings: account.activeHoldings,
					name: account.name,
					userId: account.userId,
					createdAt: account.createdAt,
					currentInvestments,
					currentBalance,
					AssetOperationTotal: assetOperationTotal,
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

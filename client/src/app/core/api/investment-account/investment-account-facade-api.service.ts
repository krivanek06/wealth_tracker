import { Injectable } from '@angular/core';
import { FetchResult } from '@apollo/client/core';
import { map, Observable } from 'rxjs';
import {
	CreateInvestmentAccountCashMutation,
	CreateInvestmentAccountHoldingMutation,
	CreateInvestmentAccountMutation,
	DeleteInvestmentAccountCashMutation,
	DeleteInvestmentAccountHoldingMutation,
	DeleteInvestmentAccountMutation,
	EditInvestmentAccountMutation,
	InvestmentAccounHoldingCreateInput,
	InvestmentAccountCashChangeFragment,
	InvestmentAccountCashChangeType,
	InvestmentAccountCashCreateInput,
	InvestmentAccountCashDeleteInput,
	InvestmentAccountEditInput,
	InvestmentAccountGrowth,
	InvestmentAccountOverviewFragment,
	InvestmentAccountTransactionOutput,
} from '../../graphql';
import { InvestmentAccountFragmentExtended } from '../../models/investment-account.model';
import { InvestmentAccountApiService } from './investment-account-api.service';
import { InvestmentAccountCashApiService } from './investment-account-cash-api.service';
import { InvestmentAccountHoldingService } from './investment-account-holding.service';

@Injectable({
	providedIn: 'root',
})
export class InvestmentAccountFacadeApiService {
	constructor(
		private investmentAccountCashApiService: InvestmentAccountCashApiService,
		private investmentAccountApiService: InvestmentAccountApiService,
		private investmentAccountHoldingService: InvestmentAccountHoldingService
	) {}

	getInvestmentAccounts(): Observable<InvestmentAccountOverviewFragment[]> {
		return this.investmentAccountApiService.getInvestmentAccounts();
	}

	getInvestmentAccountById(accountId: string): Observable<InvestmentAccountFragmentExtended> {
		return this.investmentAccountApiService.getInvestmentAccountById(accountId).pipe(
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

	createInvestmentAccount(name: string): Observable<FetchResult<CreateInvestmentAccountMutation>> {
		return this.investmentAccountApiService.createInvestmentAccount(name);
	}

	editInvestmentAccount(input: InvestmentAccountEditInput): Observable<FetchResult<EditInvestmentAccountMutation>> {
		return this.investmentAccountApiService.editInvestmentAccount(input);
	}

	deleteInvestmentAccount(accountId: string): Observable<FetchResult<DeleteInvestmentAccountMutation>> {
		return this.investmentAccountApiService.deleteInvestmentAccount(accountId);
	}

	getInvestmentAccountGrowth(accountId: string): Observable<InvestmentAccountGrowth[]> {
		return this.investmentAccountApiService.getInvestmentAccountGrowth(accountId);
	}

	getTransactionHistory(accountId: string): Observable<InvestmentAccountTransactionOutput[]> {
		return this.investmentAccountApiService.getTransactionHistory(accountId);
	}

	getAvailableTransactionSymbols(input: string): Observable<string[]> {
		return this.investmentAccountApiService.getAvailableTransactionSymbols(input);
	}

	createInvestmentAccountHolding(
		input: InvestmentAccounHoldingCreateInput
	): Observable<FetchResult<CreateInvestmentAccountHoldingMutation>> {
		return this.investmentAccountHoldingService.createInvestmentAccountHolding(input);
	}

	deleteInvestmentAccountHolding(
		accountId: string,
		history: InvestmentAccountTransactionOutput
	): Observable<FetchResult<DeleteInvestmentAccountHoldingMutation>> {
		return this.investmentAccountHoldingService.deleteInvestmentAccountHolding(accountId, history);
	}

	createInvestmentAccountCash(
		input: InvestmentAccountCashCreateInput
	): Observable<FetchResult<CreateInvestmentAccountCashMutation>> {
		return this.investmentAccountCashApiService.createInvestmentAccountCash(input);
	}

	deleteInvestmentAccountCash(
		input: InvestmentAccountCashDeleteInput,
		removingItem: InvestmentAccountCashChangeFragment
	): Observable<FetchResult<DeleteInvestmentAccountCashMutation>> {
		return this.investmentAccountCashApiService.deleteInvestmentAccountCash(input, removingItem);
	}
}

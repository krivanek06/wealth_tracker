import { Injectable } from '@angular/core';
import { FetchResult } from '@apollo/client/core';
import { Observable } from 'rxjs';
import {
	CreateInvestmentAccountCasheMutation,
	CreateInvestmentAccountHoldingMutation,
	DeleteInvestmentAccountCasheMutation,
	DeleteInvestmentAccountHoldingMutation,
	InvestmentAccounHoldingCreateInput,
	InvestmentAccountCashChangeFragment,
	InvestmentAccountCashCreateInput,
	InvestmentAccountCashDeleteInput,
	InvestmentAccountFragment,
	InvestmentAccountGrowth,
	InvestmentAccountOverviewFragment,
	InvestmentAccountTransactionInput,
	InvestmentAccountTransactionOutput,
} from '../../graphql';
import { InvestmentAccountApiService } from './investment-account-api.service';
import { InvestmentAccountCashApiService } from './investment-account-cash-api.service';

@Injectable({
	providedIn: 'root',
})
export class InvestmentAccountFacadeApiService {
	constructor(
		private investmentAccountCashApiService: InvestmentAccountCashApiService,
		private investmentAccountApiService: InvestmentAccountApiService
	) {}

	getInvestmentAccounts(): Observable<InvestmentAccountOverviewFragment[]> {
		return this.investmentAccountApiService.getInvestmentAccounts();
	}

	getInvestmentAccountById(accountId: string): Observable<InvestmentAccountFragment> {
		return this.investmentAccountApiService.getInvestmentAccountById(accountId);
	}

	getInvestmentAccountGrowth(accountId: string): Observable<InvestmentAccountGrowth[]> {
		return this.investmentAccountApiService.getInvestmentAccountGrowth(accountId);
	}

	getTransactionHistory(input: InvestmentAccountTransactionInput): Observable<InvestmentAccountTransactionOutput[]> {
		return this.investmentAccountApiService.getTransactionHistory(input);
	}

	getAvailableTransactionSymbols(input: string): Observable<string[]> {
		return this.investmentAccountApiService.getAvailableTransactionSymbols(input);
	}

	createInvestmentAccountHolding(
		input: InvestmentAccounHoldingCreateInput
	): Observable<FetchResult<CreateInvestmentAccountHoldingMutation>> {
		return this.investmentAccountApiService.createInvestmentAccountHolding(input);
	}

	deleteInvestmentAccountHolding(
		accountId: string,
		history: InvestmentAccountTransactionOutput
	): Observable<FetchResult<DeleteInvestmentAccountHoldingMutation>> {
		return this.investmentAccountApiService.deleteInvestmentAccountHolding(accountId, history);
	}

	createInvestmentAccountCash(
		input: InvestmentAccountCashCreateInput
	): Observable<FetchResult<CreateInvestmentAccountCasheMutation>> {
		return this.investmentAccountCashApiService.createInvestmentAccountCash(input);
	}

	deleteInvestmentAccountCash(
		input: InvestmentAccountCashDeleteInput,
		removingItem: InvestmentAccountCashChangeFragment
	): Observable<FetchResult<DeleteInvestmentAccountCasheMutation>> {
		return this.investmentAccountCashApiService.deleteInvestmentAccountCash(input, removingItem);
	}
}

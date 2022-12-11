import { Injectable } from '@angular/core';
import { FetchResult } from '@apollo/client/core';
import { Observable } from 'rxjs';
import {
	CreateInvestmentAccountCasheMutation,
	CreateInvestmentAccountHoldingMutation,
	CreateInvestmentAccountMutation,
	DeleteInvestmentAccountCasheMutation,
	DeleteInvestmentAccountHoldingMutation,
	DeleteInvestmentAccountMutation,
	EditInvestmentAccountMutation,
	InvestmentAccounHoldingCreateInput,
	InvestmentAccountCashChangeFragment,
	InvestmentAccountCashCreateInput,
	InvestmentAccountCashDeleteInput,
	InvestmentAccountEditInput,
	InvestmentAccountFragment,
	InvestmentAccountGrowth,
	InvestmentAccountOverviewFragment,
	InvestmentAccountTransactionOutput,
} from '../../graphql';
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

	getInvestmentAccountById(accountId: string): Observable<InvestmentAccountFragment> {
		return this.investmentAccountApiService.getInvestmentAccountById(accountId);
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

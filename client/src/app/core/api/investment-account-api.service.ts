import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import {
	CreateInvestmentAccountCasheGQL,
	CreateInvestmentAccountGQL,
	CreateInvestmentAccountHoldingGQL,
	DeleteInvestmentAccountCasheGQL,
	DeleteInvestmentAccountGQL,
	DeleteInvestmentAccountHoldingGQL,
	EditInvestmentAccountGQL,
	GetInvestmentAccountByIdGQL,
	GetInvestmentAccountGrowthGQL,
	GetInvestmentAccountsGQL,
	InvestmentAccountFragment,
	InvestmentAccountGrowth,
	InvestmentAccountOverviewFragment,
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
		private deleteInvestmentAccountCasheGQL: DeleteInvestmentAccountCasheGQL
	) {}

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
}

import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import {
	InvestmentAccountFragment,
	InvestmentAccountFragmentDoc,
	InvestmentAccountOverviewFragment,
} from '../../graphql';

@Injectable({
	providedIn: 'root',
})
export class InvestmentAccountCacheService {
	constructor(private apollo: Apollo) {}

	getInvestmentAccountFromCache(accountId: string): InvestmentAccountFragment {
		const fragment = this.apollo.client.readFragment<InvestmentAccountFragment>({
			id: `InvestmentAccount:${accountId}`,
			fragmentName: 'InvestmentAccount',
			fragment: InvestmentAccountFragmentDoc,
		});

		// not found
		if (!fragment) {
			throw new Error(`[InvestmentAccountApiService]: Unable to find the correct invetment account`);
		}

		return fragment;
	}

	updateInvestmentAccount(data: InvestmentAccountFragment): void {
		this.apollo.client.writeFragment<InvestmentAccountOverviewFragment>({
			id: `InvestmentAccount:${data.id}`,
			fragmentName: 'InvestmentAccount',
			fragment: InvestmentAccountFragmentDoc,
			data: {
				...data,
			},
		});
	}
}

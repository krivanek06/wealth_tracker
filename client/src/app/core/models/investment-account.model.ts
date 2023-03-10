import { InvestmentAccountFragment } from '../graphql';

export interface InvestmentAccountFragmentExtended extends InvestmentAccountFragment {
	currentCash: number;
	currentInvested: number;
	currentBalance: number;
}

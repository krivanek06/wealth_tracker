import { InvestmentAccountFragment } from '../graphql';

export interface InvestmentAccountFragmentExtended extends InvestmentAccountFragment {
	currentCash: number;
	currentInvestments: number;
	currentBalance: number;
	AssetOperationTotal: number;
	DepositTotal: number;
	WithdrawalTotal: number;
}

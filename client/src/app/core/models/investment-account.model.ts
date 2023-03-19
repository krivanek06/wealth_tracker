import { InvestmentAccountDetailsFragment } from '../graphql';

export interface InvestmentAccountFragmentExtended extends InvestmentAccountDetailsFragment {
	currentCash: number;
	currentInvestments: number;
	currentBalance: number;
	AssetOperationTotal: number;
	DepositTotal: number;
	WithdrawalTotal: number;
}

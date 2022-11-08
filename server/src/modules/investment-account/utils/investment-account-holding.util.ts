import { InvestmentAccountHoldingHistory } from '../entities';
import { HoldingInputData } from '../inputs';
import { SharedServiceUtil } from './../../../utils';

export class InvestmentAccountHoldingUtil {
	static createInvestmentAccountHoldingHistory(data: HoldingInputData): InvestmentAccountHoldingHistory {
		const newHoldingHistory: InvestmentAccountHoldingHistory = {
			itemId: SharedServiceUtil.getUUID(),
			units: data.units,
			investedAmount: data.investedAmount,
			date: new Date(data.date),
		};

		return newHoldingHistory;
	}
}

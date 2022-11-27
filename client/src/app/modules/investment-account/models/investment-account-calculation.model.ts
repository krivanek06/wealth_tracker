import { InvestmentAccountCashChangeType } from '../../../core/graphql';
export interface DailyInvestmentChange {
	dailyChange: number;
	dailyChangesPercentage: number;
}

export interface SectorAllocation {
	sectorName: string;
	symbols: string[]; // distinct symbols are under this sector
}

export type CashAllocation = { [key in InvestmentAccountCashChangeType]: number };

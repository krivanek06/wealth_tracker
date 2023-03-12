export interface DailyInvestmentChange {
	dailyChange: number;
	dailyChangesPercentage: number;
}

export interface SectorAllocation {
	sectorName: string;
	symbols: string[]; // distinct symbols are under this sector
}

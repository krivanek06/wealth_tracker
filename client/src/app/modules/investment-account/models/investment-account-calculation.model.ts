export interface DailyInvestmentChange {
	dailyChange: number;
	dailyChangesPercentage: number;
}

export interface SectorAllocationCalculation {
	sectorName: string;
	value: number;
	symbols: string[]; // distinct symbols are under this sector
	units: number; // total symbol units unter this sector
}

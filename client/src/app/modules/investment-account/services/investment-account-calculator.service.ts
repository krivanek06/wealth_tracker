import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { InvestmentAccountApiService } from '../../../core/api';
import { DailyInvestmentChange, SectorAllocationCalculation } from '../models';

@Injectable({
	providedIn: 'root',
})
export class InvestmentAccountCalculatorService {
	constructor(private investmentAccountApiService: InvestmentAccountApiService) {}

	/**
	 *
	 * @param accountId
	 * @returns aggregated investedAmount for each symbol
	 */
	getInvestmentAccountByIdTotalInvestedAmount(accountId: string): Observable<number> {
		return this.investmentAccountApiService.getInvestmentAccountById(accountId).pipe(
			map((res) =>
				res.activeHoldings.reduce((acc, curr) => {
					return acc + curr.totalValue;
				}, 0)
			)
		);
	}

	/**
	 * Calculates invested amount based on current price * units
	 *
	 * @param accountId
	 * @returns
	 */
	getInvestmentAccountByIdCurrentInvestedAmout(accountId: string): Observable<number> {
		return this.investmentAccountApiService.getInvestmentAccountById(accountId).pipe(
			map((res) =>
				res.activeHoldings.reduce((acc, curr) => {
					return acc + curr.units * curr.assetGeneral.assetQuote.price;
				}, 0)
			)
		);
	}

	/**
	 * Calculates total daily change for all active investments
	 *
	 * @param accountId
	 * @returns
	 */
	getDailyInvestmentChange(accountId: string): Observable<DailyInvestmentChange> {
		return this.investmentAccountApiService.getInvestmentAccountById(accountId).pipe(
			map((res) => {
				// get list of changesPercentage and compute average
				const valuePrctList = res.activeHoldings.map((d) => d.assetGeneral.assetQuote.changesPercentage);
				const valuePrctAvg = valuePrctList.reduce((a, b) => a + b, 0) / valuePrctList.length || 0;

				// get all daily change in value times units
				const valueChange = res.activeHoldings
					.map((d) => d.units * d.assetGeneral.assetQuote.change)
					.reduce((a, b) => a + b, 0);

				return {
					dailyChange: valueChange,
					dailyChangesPercentage: valuePrctAvg,
				};
			})
		);
	}

	getSectorAllocation(accountId: string): Observable<SectorAllocationCalculation[]> {
		return this.investmentAccountApiService.getInvestmentAccountById(accountId).pipe(
			map((res) =>
				res.activeHoldings.reduce((acc, curr) => {
					const allocationIndex = acc.findIndex((d) => d.sectorName === curr.sector);
					// not yet added
					if (allocationIndex !== -1) {
						acc[allocationIndex].symbols = [...acc[allocationIndex].symbols, curr.assetId];
						acc[allocationIndex].units += curr.units;
						acc[allocationIndex].value += curr.totalValue;
						return acc;
					}

					const data: SectorAllocationCalculation = {
						sectorName: curr.sector,
						symbols: [curr.assetId],
						units: curr.units,
						value: curr.totalValue,
					};

					return [...acc, data];
				}, [] as SectorAllocationCalculation[])
			)
		);
	}
}

import { Injectable } from '@angular/core';
import {
	InvestmentAccountActiveHoldingOutputFragment,
	InvestmentAccountCashChangeType,
	InvestmentAccountFragment,
	InvestmentAccountGrowth,
} from '../../../core/graphql';
import { DateServiceUtil } from '../../../core/utils';
import { ValuePresentItem } from '../../../shared/models';
import {
	CashAllocation,
	DailyInvestmentChange,
	InvestmentAccountPeriodChange,
	PeriodChangeDate,
	SectorAllocation,
} from '../models';

@Injectable({
	providedIn: 'root',
})
export class InvestmentAccountCalculatorService {
	constructor() {}

	/**
	 *
	 * @param account
	 * @returns aggregated investedAmount for each symbol
	 */
	getInvestmentAccountByIdTotalInvestedAmount(account: InvestmentAccountFragment): number {
		return account.activeHoldings.reduce((acc, curr) => {
			return acc + curr.totalValue;
		}, 0);
	}

	/**
	 * Calculates invested amount based on current price * units
	 *
	 * @param account
	 * @returns
	 */
	getInvestmentAccountByIdCurrentInvestedAmout(account: InvestmentAccountFragment): number {
		return account.activeHoldings.reduce((acc, curr) => {
			return acc + curr.units * curr.assetGeneral.assetQuote.price;
		}, 0);
	}

	/**
	 * Calculates total daily change for all active investments
	 *
	 * @param account
	 * @returns
	 */
	getDailyInvestmentChange(account: InvestmentAccountFragment): DailyInvestmentChange {
		// get list of changesPercentage and compute average
		const valuePrctList = account.activeHoldings.map((d) => d.assetGeneral.assetQuote.changesPercentage);
		const valuePrctAvg = valuePrctList.reduce((a, b) => a + b, 0) / valuePrctList.length || 0;

		// get all daily change in value times units
		const valueChange = account.activeHoldings
			.map((d) => d.units * d.assetGeneral.assetQuote.change)
			.reduce((a, b) => a + b, 0);

		return {
			dailyChange: valueChange,
			dailyChangesPercentage: valuePrctAvg,
		};
	}

	/**
	 *
	 * @param account
	 * @returns how many symbols are allocated for a specific sector and what is the
	 *          total value allocated
	 */
	getSectorAllocation(account: InvestmentAccountFragment): ValuePresentItem<SectorAllocation>[] {
		const totalInvestedAmount = account.activeHoldings.reduce((acc, curr) => acc + curr.totalValue, 0);
		return account.activeHoldings.reduce((acc, curr) => {
			const allocationIndex = acc.findIndex((d) => d.name === curr.sector);

			// exists
			if (allocationIndex !== -1) {
				acc[allocationIndex].item.symbols = [...acc[allocationIndex].item.symbols, curr.assetId];
				acc[allocationIndex].valuePrct += curr.totalValue / totalInvestedAmount;
				acc[allocationIndex].value += curr.totalValue;
				return acc;
			}

			const valueItem: ValuePresentItem<SectorAllocation> = {
				color: '#fe22cc',
				imageSrc: null,
				imageType: 'url',
				name: curr.sector,
				value: curr.totalValue,
				item: {
					sectorName: curr.sector,
					symbols: [curr.assetId],
				},
				valuePrct: curr.totalValue / totalInvestedAmount,
			};

			return [...acc, valueItem];
		}, [] as ValuePresentItem<SectorAllocation>[]);
	}

	/**
	 *
	 * @param account
	 * @returns cash allocated by types
	 */
	getCashCategories(account: InvestmentAccountFragment): CashAllocation {
		return account.cashChange.reduce(
			(acc, curr) => {
				return { ...acc, [curr.type]: acc[curr.type] + curr.cashValue };
			},
			{
				ASSET_OPERATION: 0,
				DEPOSIT: 0,
				WITHDRAWAL: 0,
			} as { [key in InvestmentAccountCashChangeType]: number }
		);
	}

	getInvestmentAccountPeriodChange(
		activeHoldings: InvestmentAccountActiveHoldingOutputFragment[],
		accountGrowthData: InvestmentAccountGrowth[]
	): InvestmentAccountPeriodChange[] {
		if (accountGrowthData.length === 0) {
			return [];
		}

		// reverse accountGrowthData so that dates are in DESC
		const reveresData = accountGrowthData.slice().reverse();

		const today = new Date();

		// calculate today ballance from active symbols
		const todayBalance = activeHoldings.reduce((acc, curr) => acc + curr.units * curr.assetGeneral.assetQuote.price, 0);

		const result = PeriodChangeDate.map((period) => {
			const timeDiff = reveresData.find(
				(d) => DateServiceUtil.differenceInBusinessDays(today, d.date) >= period.value - 1
			);
			if (!timeDiff) {
				return { title: period.name, value: -1, valuePrct: -1 } as InvestmentAccountPeriodChange;
			}
			const timeDiffValue = timeDiff.cash + timeDiff.invested;

			const value = todayBalance - timeDiffValue;
			const valuePrct = (todayBalance - timeDiffValue) / timeDiffValue;

			return { title: period.name, value, valuePrct } as InvestmentAccountPeriodChange;
		});

		return result;
	}
}

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MomentServiceUtil, SharedServiceUtil } from '../../../utils';
import { AssetGeneralService } from '../../asset-manager';
import { INVESTMENT_ACCOUNT_ERROR, INVESTMENT_ACCOUNT_MAX } from '../dto';
import { InvestmentAccount, InvestmentAccountHolding } from '../entities';
import { InvestmentAccountCreateInput, InvestmentAccountEditInput, InvestmentAccountGrowthInput } from '../inputs';
import { InvestmentAccountActiveHoldingOutput, InvestmentAccountGrowth } from '../outputs';
import { InvestmentAccountRepositoryService } from './investment-account-repository.service';

@Injectable()
export class InvestmentAccountService {
	constructor(
		private investmentAccountRepositoryService: InvestmentAccountRepositoryService,
		private assetGeneralService: AssetGeneralService
	) {}

	getInvestmentAccounts(userId: string): Promise<InvestmentAccount[]> {
		return this.investmentAccountRepositoryService.getInvestmentAccounts(userId);
	}

	async getInvestmentAccountById(investmentAccountId: string, userId: string): Promise<InvestmentAccount> {
		return this.investmentAccountRepositoryService.getInvestmentAccountById(investmentAccountId, userId);
	}

	/**
	 *
	 * @param holdings
	 * @returns loaded assetGeneral info for all active symbol
	 */
	async getActiveHoldingOutput(holdings: InvestmentAccountHolding[]): Promise<InvestmentAccountActiveHoldingOutput[]> {
		const activeHoldingAssetIds = holdings.map((d) => d.assetId);

		// load asset general
		const activeHoldingAssetGeneral = await this.assetGeneralService.getAssetGeneralForSymbols(activeHoldingAssetIds);

		// create result
		const result = holdings.map((holding) => {
			// get total value & units
			const { totalValue, units } = holding.holdingHistory.reduce(
				(acc, curr) => {
					const multy = curr.type === 'BUY' ? 1 : -1;
					const newValue = acc.totalValue + curr.unitValue * curr.units * multy;
					const newUnits = acc.units + curr.units * multy;

					return { units: newUnits, totalValue: newValue };
				},
				{ units: 0, totalValue: 0 } as { units: number; totalValue: number }
			);

			// calculate bep
			const beakEvenPrice = SharedServiceUtil.roundDec(totalValue / units);

			const assetGeneral = activeHoldingAssetGeneral.find((asset) => asset.id === holding.assetId);
			const merge: InvestmentAccountActiveHoldingOutput = {
				id: holding.id,
				assetId: holding.assetId,
				type: holding.type,
				sector: holding.sector,
				investmentAccountId: holding.investmentAccountId,
				assetGeneral,
				totalValue,
				units,
				beakEvenPrice,
			};
			return merge;
		});

		return result;
	}

	/**
	 * Returns the investment account history growth, based
	 * on the input values
	 *
	 * @param userId
	 * @param input
	 */
	async getInvestmentAccountGrowth(
		input: InvestmentAccountGrowthInput,
		userId: string
	): Promise<InvestmentAccountGrowth[]> {
		// load investment account
		const investmentAccount = await this.investmentAccountRepositoryService.getInvestmentAccountById(
			input.investmenAccountId,
			userId
		);

		// symbolIds filter out by sectors
		const filteredHoldings = investmentAccount.holdings
			.filter((d) => (input.sectors.length === 0 ? true : input.sectors.includes(d.sector)))
			// just in case to not get index overflow
			.filter((d) => d.holdingHistory.length > 0);

		const yesterDay = MomentServiceUtil.format(MomentServiceUtil.subDays(new Date(), 1));

		// load historical prices for each holding
		// caution! => every historicalPrices[N].assetHistoricalPricesData have different length, because of slicing
		const historicalPrices = await Promise.all(
			filteredHoldings.map((d) =>
				this.assetGeneralService.getAssetHistoricalPricesStartToEnd(d.assetId, d.holdingHistory[0].date, yesterDay)
			)
		);

		// create investment growth chart by each asset - check if asset was owned d.holdingHistory[N].unit that date
		// investedGrowth -> array of {date, calculcation} - where calculation is the reduced total invested amount on that date
		const investedGrowth = historicalPrices
			.map((d) => {
				const holdingHistory = filteredHoldings.find((h) => h.assetId === d.id).holdingHistory ?? [];
				let holdingIndex = 0; // increate holdingCurrentIndex if holdingHistory[holdingCurrentIndex].date is same as price.date
				let unitsAccumulated = holdingHistory[holdingIndex]?.units ?? 0; // keep track of units by BUY/SELL operation

				// store asset.units * price.close
				const assetGrowthCalculation = d.assetHistoricalPricesData.map((price) => {
					if (price.date >= holdingHistory[holdingIndex + 1]?.date) {
						holdingIndex += 1;
						const tmp = holdingHistory[holdingIndex];
						unitsAccumulated += tmp.type === 'BUY' ? tmp.units : -tmp.units;
					}

					return { date: price.date, calculation: unitsAccumulated * price.close };
				});
				return assetGrowthCalculation;
			})
			.reduce((acc, curr) => {
				// each data in { curr: { date: string; calculation: number }[]} add to the 'acc' array
				curr.forEach((dataElement) => {
					// accumulated each assetGrowthCalculation into one investment growht number[] array
					const elementIndex = acc.findIndex((el) => el.date === dataElement.date);

					// if elementIndex exists, add value to it
					if (elementIndex > -1) {
						acc[elementIndex].calc += dataElement.calculation;
						acc[elementIndex].ownedAssets += 1;
						return;
					}

					// data is not yet in the array
					if (acc.length === 0 || dataElement.date < acc[0].date) {
						acc = [{ date: dataElement.date, calc: dataElement.calculation, ownedAssets: 1 }, ...acc]; // append element to the start
					} else if (dataElement.date > acc[acc.length - 1].date) {
						acc = [...acc, { date: dataElement.date, calc: dataElement.calculation, ownedAssets: 1 }]; // append element to the end
					} else {
						// append somewhere middle, find first larger date
						const appendIndex = acc.findIndex((d) => dataElement.date < d.date);
						acc.splice(appendIndex, 0, { date: dataElement.date, calc: dataElement.calculation, ownedAssets: 1 });
					}
				});

				return acc;
			}, [] as { date: string; calc: number; ownedAssets: number }[]);

		// select soonest date to generate date range for chart data
		const cashGrowth = investmentAccount.cashChange;
		const soonestDate = cashGrowth[0]?.date < investedGrowth[0]?.date ? cashGrowth[0].date : investedGrowth[0].date;

		const result = MomentServiceUtil.getDates(soonestDate, new Date()).map((date) => {
			const formattedDate = MomentServiceUtil.format(date);
			const growth = investedGrowth.find((d) => d.date === formattedDate);
			const invested = growth?.calc ?? 0;
			const ownedAssets = growth?.ownedAssets ?? 0;

			const cash = cashGrowth.find((d) => d.date === formattedDate)?.cashValue ?? 0;

			const data: InvestmentAccountGrowth = {
				invested,
				cash,
				ownedAssets,
				date: formattedDate,
			};
			return data;
		});

		// filter out if cash and investment is 0
		// happens because there is a hollyday data, but we create custom range by MomentServiceUtil.getDates(soonestDate, new Date())
		const nonZeroResult = result.filter((d) => d.cash + d.invested !== 0);

		return nonZeroResult;
	}

	async createInvestmentAccount(input: InvestmentAccountCreateInput, userId: string): Promise<InvestmentAccount> {
		const investmentAccountCount = await this.investmentAccountRepositoryService.countInvestmentAccounts(userId);

		// prevent creating more than 5 investment accounts per user
		if (investmentAccountCount >= INVESTMENT_ACCOUNT_MAX) {
			throw new HttpException(INVESTMENT_ACCOUNT_ERROR.NOT_ALLOWED_TO_CTEATE, HttpStatus.FORBIDDEN);
		}

		// create investment account
		const investmentAccount = await this.investmentAccountRepositoryService.createInvestmentAccount(input.name, userId);

		return investmentAccount;
	}

	async editInvestmentAccount(input: InvestmentAccountEditInput, userId: string): Promise<InvestmentAccount> {
		await this.investmentAccountRepositoryService.isInvestmentAccountExist(input.investmentAccountId, userId);
		return this.investmentAccountRepositoryService.updateInvestmentAccount(input.investmentAccountId, {
			name: input.name,
		});
	}

	async deleteInvestmentAccount(investmentAccountId: string, userId: string): Promise<InvestmentAccount> {
		await this.investmentAccountRepositoryService.isInvestmentAccountExist(investmentAccountId, userId);
		return this.investmentAccountRepositoryService.deleteInvestmentAccount(investmentAccountId);
	}
}

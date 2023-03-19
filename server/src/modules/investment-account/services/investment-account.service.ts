import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MomentServiceUtil, SharedServiceUtil } from '../../../utils';
import { AssetGeneralService } from '../../asset-manager';
import { INVESTMENT_ACCOUNT_ERROR, INVESTMENT_ACCOUNT_MAX } from '../dto';
import { InvestmentAccount, InvestmentAccountCashChange } from '../entities';
import { InvestmentAccountCreateInput, InvestmentAccountEditInput, InvestmentAccountGrowthInput } from '../inputs';
import { InvestmentAccountGrowth } from '../outputs';
import { InvestmentAccountRepositoryService } from './investment-account-repository.service';

@Injectable()
export class InvestmentAccountService {
	constructor(
		private investmentAccountRepositoryService: InvestmentAccountRepositoryService,
		private assetGeneralService: AssetGeneralService
	) {}

	getCurrentCashByAccount(cashChanges: InvestmentAccountCashChange[]): number {
		return cashChanges.reduce((acc, curr) => {
			if (curr.type === 'WITHDRAWAL') {
				return acc - curr.cashValue;
			}
			return acc + curr.cashValue;
		}, 0);
	}

	getInvestmentAccountByUserId(userId: string): Promise<InvestmentAccount | null> {
		return this.investmentAccountRepositoryService.getInvestmentAccountByUserId(userId);
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
		const investmentAccount = await this.investmentAccountRepositoryService.getInvestmentAccountByUserIdStrict(userId);

		// symbolIds filter out by sectors
		const filteredHoldings = investmentAccount.holdings
			.filter((d) => (input.sectors.length === 0 ? true : input.sectors.includes(d.sector)))
			// just in case to not get index overflow
			.filter((d) => d.holdingHistory.length > 0)
			// check if date is not today - otherwise we get an error
			.filter((d) => !MomentServiceUtil.isToday(d.holdingHistory[0].date));

		const yesterDay = MomentServiceUtil.format(MomentServiceUtil.subDays(new Date(), 1));

		// load historical prices for each holding
		// caution! => every historicalPrices[N].assetHistoricalPricesData have different length, because of slicing
		const historicalPrices = await Promise.all(
			filteredHoldings.map((d) =>
				this.assetGeneralService.getAssetHistoricalPricesStartToEnd(d.assetId, d.holdingHistory[0].date, yesterDay)
			)
		);

		// create investment growth chart by each asset - check if asset was owned d.holdingHistory[N].unit that date
		// investedGrowth -> array of {date, calculation} - where calculation is the reduced total invested amount on that date
		const investedGrowth = historicalPrices
			.map((d) => {
				const holdingHistory = filteredHoldings.find((h) => h.assetId === d.id).holdingHistory ?? [];
				let holdingIndex = 0; // increase holdingCurrentIndex if holdingHistory[holdingCurrentIndex].date is same as price.date
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

		const cashGrowth = MomentServiceUtil.getDates(investmentAccount.cashChange[0]?.date, yesterDay).reduce(
			(acc, date) => {
				// YYYY-MM-DD
				const formattedDate = MomentServiceUtil.format(date);
				// check if there is new cash entry -> can be multiple entries per day - multiple asset operations, etc.
				const existingCashEntries = investmentAccount.cashChange.filter((d) => d.date === formattedDate);
				// calculate cash value per date
				const cashPerDate = this.getCurrentCashByAccount(existingCashEntries);
				// create difference of new and previous entry
				const currentCash = (acc[acc.length - 1]?.calculation ?? 0) + cashPerDate;

				const data = {
					date: formattedDate,
					calculation: currentCash,
				};

				return [...acc, data];
			},
			[] as { date: string; calculation: number }[]
		);

		// select soonest date to generate date range for chart data
		const soonestDate = cashGrowth[0]?.date < investedGrowth[0]?.date ? cashGrowth[0]?.date : investedGrowth[0]?.date;

		const result = MomentServiceUtil.getDates(soonestDate, yesterDay).map((date) => {
			const formattedDate = MomentServiceUtil.format(date);
			const growth = investedGrowth.find((d) => d.date === formattedDate);
			const invested = growth?.calc ?? 0;
			const ownedAssets = growth?.ownedAssets ?? 0;

			const cash = cashGrowth.find((d) => d.date === formattedDate)?.calculation ?? 0;

			const data: InvestmentAccountGrowth = {
				invested: SharedServiceUtil.roundDec(invested),
				cash: SharedServiceUtil.roundDec(cash),
				ownedAssets,
				date: formattedDate,
			};
			return data;
		});

		// filter out if cash and investment is 0
		// happens because there is a holyday data, but we create custom range by MomentServiceUtil.getDates(soonestDate, new Date())
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
		await this.investmentAccountRepositoryService.getInvestmentAccountByUserIdStrict(userId);
		return this.investmentAccountRepositoryService.updateInvestmentAccount(userId, {
			name: input.name,
		});
	}

	async deleteInvestmentAccount(userId: string): Promise<InvestmentAccount> {
		await this.investmentAccountRepositoryService.getInvestmentAccountByUserIdStrict(userId);
		return this.investmentAccountRepositoryService.deleteInvestmentAccount(userId);
	}
}

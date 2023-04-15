import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ChartSeries } from '../../../shared/dto';
import { MomentServiceUtil } from '../../../utils';
import { AssetGeneralService } from '../../asset-manager';
import { INVESTMENT_ACCOUNT_ERROR, INVESTMENT_ACCOUNT_MAX } from '../dto';
import { InvestmentAccount, InvestmentAccountCashChange } from '../entities';
import { InvestmentAccountEditInput, InvestmentAccountGrowthInput } from '../inputs';
import { InvestmentAccountGrowth } from '../outputs';
import { INVESTMENT_ACCOUNT_DEFAULT_NAME } from './../dto/investment-accont-constants.dto';
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
	 * Returns the investment account history growth for each asset
	 *
	 * @param userId
	 */
	async getInvestmentAccountGrowthAssets(input: InvestmentAccountGrowthInput, userId: string): Promise<ChartSeries[]> {
		// load investment account
		const investmentAccount = await this.investmentAccountRepositoryService.getInvestmentAccountByUserIdStrict(userId);

		const filteredHoldings = investmentAccount.holdings
			// symbolIds filter out by sectors
			.filter((d) => (input.sectors.length === 0 ? true : input.sectors.includes(d.sector)))
			// just in case to not get index overflow
			.filter((d) => d.holdingHistory.length > 0)
			// check if date is not today - otherwise we get an error loading historical prices
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
		const investedGrowth = historicalPrices.map((d) => {
			const holdingHistory = filteredHoldings.find((h) => h.assetId === d.id).holdingHistory ?? [];
			let holdingIndex = 0; // increase holdingCurrentIndex if holdingHistory[holdingCurrentIndex].date is same as price.date
			let unitsAccumulated = 0; // keep track of units by BUY/SELL operation

			// store asset.units * price.close
			const assetGrowthCalculation = d.assetHistoricalPricesData.map((price) => {
				// can be multiple entries for the same date
				while (price.date === holdingHistory[holdingIndex]?.date) {
					const tmp = holdingHistory[holdingIndex];
					holdingIndex += 1;
					unitsAccumulated += tmp.type === 'BUY' ? tmp.units : -tmp.units;
				}

				return [MomentServiceUtil.getTime(price.date), unitsAccumulated * price.close] as [number, number];
			});

			const result: ChartSeries = {
				name: d.id,
				data: assetGrowthCalculation,
			};

			return result;
		});

		return investedGrowth;
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
		const investedGrowthAssets = await this.getInvestmentAccountGrowthAssets(input, userId);

		// create investment growth chart by each asset - check if asset was owned d.holdingHistory[N].unit that date
		// investedGrowth -> array of {date, calculation} - where calculation is the reduced total invested amount on that date
		const investedGrowth = investedGrowthAssets.reduce((acc, curr) => {
			// each data in { curr: { date: string; calculation: number }[]} add to the 'acc' array
			curr.data.forEach((dataElement) => {
				const calculation = dataElement[1]; // dataElement[1] is value
				const date = MomentServiceUtil.getTime(dataElement[0]); // dataElement[0] is the date

				// ignore weekends
				if (MomentServiceUtil.isWeekend(date)) {
					return;
				}

				// check if holiday
				if (MomentServiceUtil.isHoliday(date)) {
					return;
				}

				// accumulated each assetGrowthCalculation into one investment growth number[] array
				const elementIndex = acc.findIndex((el) => el.date === date);

				// if elementIndex exists, add value to it
				if (elementIndex > -1) {
					acc[elementIndex].invested += calculation;
					acc[elementIndex].ownedAssets += calculation > 0 ? 1 : 0;
					return;
				}

				if (acc.length === 0 || date < acc[0].date) {
					// data is not yet in the array
					acc = [{ date: date, invested: calculation, ownedAssets: 1 }, ...acc]; // append element to the start
				} else if (date > acc[acc.length - 1].date) {
					// data in array
					acc = [...acc, { date: date, invested: calculation, ownedAssets: calculation > 0 ? 1 : 0 }]; // append element to the end
				} else {
					// append somewhere middle, find first larger date
					const appendIndex = acc.findIndex((d) => date < d.date);
					acc.splice(appendIndex, 0, { date: date, invested: calculation, ownedAssets: 0 });
				}
			});

			return acc;
		}, [] as InvestmentAccountGrowth[]);

		return investedGrowth;
	}

	async createInvestmentAccount(userId: string): Promise<InvestmentAccount> {
		const investmentAccountCount = await this.investmentAccountRepositoryService.countInvestmentAccounts(userId);

		// prevent creating more than 5 investment accounts per user
		if (investmentAccountCount >= INVESTMENT_ACCOUNT_MAX) {
			throw new HttpException(INVESTMENT_ACCOUNT_ERROR.NOT_ALLOWED_TO_CREATE, HttpStatus.FORBIDDEN);
		}

		// create investment account
		const investmentAccount = await this.investmentAccountRepositoryService.createInvestmentAccount(
			INVESTMENT_ACCOUNT_DEFAULT_NAME,
			userId
		);

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

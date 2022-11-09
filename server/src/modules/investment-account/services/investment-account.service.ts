import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma';
import { AssetGeneralService } from '../../asset-manager';
import { INVESTMENT_ACCOUNT_ERROR } from '../dto';
import { InvestmentAccount } from '../entities';
import { InvestmentAccountCreateInput, InvestmentAccountEditInput, InvestmentAccountGrowthInput } from '../inputs';
import { InvestmentAccountGrowth } from '../outputs';
import { MomentServiceUtil } from './../../../utils/date-functionts';

@Injectable()
export class InvestmentAccountService {
	constructor(private prisma: PrismaService, private assetGeneralService: AssetGeneralService) {}

	getInvestmentAccounts(userId: string): Promise<InvestmentAccount[]> {
		return this.prisma.investmentAccount.findMany({
			where: {
				userId,
			},
		});
	}

	/**
	 * TODO: maybe move this to the FE ? - what if I will add/remove stocks
	 * TODO: then this has to always recalculated
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
		const investmentAccount = await this.getInvestmentAccountById(input.investmenAccountId, userId);

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
				let holdingCurrentIndex = 0;

				// store asset.units * price.close
				const assetGrowthCalculation = d.assetHistoricalPricesData.map((price) => {
					// increate holdingCurrentIndex if holdingHistory[holdingCurrentIndex].date is same as price.date
					holdingCurrentIndex =
						price.date >= holdingHistory[holdingCurrentIndex + 1]?.date ? holdingCurrentIndex + 1 : holdingCurrentIndex;

					return { date: price.date, calculation: holdingHistory[holdingCurrentIndex].units * price.close };
				});
				return assetGrowthCalculation;
			})
			.reduce((acc, curr) => {
				// each data in { curr: { date: string; calculation: number }[]} add tp the 'acc' array
				curr.forEach((dataElement) => {
					// 		// empty acc, happends only once
					if (acc.length === 0) {
						acc.push(dataElement);
						return;
					}

					// accumulated each assetGrowthCalculation into one investment growht number[] array
					const elementIndex = acc.findIndex((el) => el.date === dataElement.date);

					// if elementIndex exists, add value to it
					if (elementIndex > -1) {
						acc[elementIndex].calculation += dataElement.calculation;
						return;
					}

					// data is not yet in the array
					if (dataElement.date < acc[0].date) {
						acc = [dataElement, ...acc]; // append element to the start
					} else if (dataElement.date > acc[acc.length - 1].date) {
						acc = [...acc, dataElement]; // append element to the end
					}
				});

				return acc;
			}, [] as { date: string; calculation: number }[]);

		// generate cash calculation since we had cash in account
		let cashChangeIndex = 0; // needed because of cash change in investmentAccount.cashChange
		const cashGrowth = MomentServiceUtil.getDates(investmentAccount.cashChange[0]?.date, new Date()).map((d) => {
			const formattedDate = MomentServiceUtil.format(d);
			const nextCashChange = investmentAccount.cashChange[cashChangeIndex + 1];
			cashChangeIndex += formattedDate >= nextCashChange?.date && !!nextCashChange ? 1 : 0;
			return {
				date: formattedDate,
				calculation: investmentAccount.cashChange[cashChangeIndex].cashCurrent,
			};
		});

		// select soonest date to generate date range for chart data
		const soonestDate = cashGrowth[0]?.date < investedGrowth[0]?.date ? cashGrowth[0].date : investedGrowth[0].date;
		const dateRange = MomentServiceUtil.getDates(soonestDate, new Date());

		const result = dateRange.map((date) => {
			const formattedDate = MomentServiceUtil.format(date);
			const invested = investedGrowth.find((d) => d.date === formattedDate)?.calculation ?? 0;
			const cash = cashGrowth.find((d) => d.date === formattedDate)?.calculation ?? 0;

			const data: InvestmentAccountGrowth = {
				invested,
				cash,
				date: formattedDate,
				ownedAssets: 0, // TODO fix this
			};
			return data;
		});

		return result;
	}

	async getInvestmentAccountById(investmentAccountId: string, userId: string): Promise<InvestmentAccount> {
		// load investment account
		const investmentAccount = await this.prisma.investmentAccount.findFirst({
			where: {
				id: investmentAccountId,
				userId,
			},
		});

		// not found investment account
		if (!investmentAccount) {
			throw new HttpException(INVESTMENT_ACCOUNT_ERROR.NOT_FOUND, HttpStatus.NOT_FOUND);
		}

		return investmentAccount;
	}

	async createInvestmentAccount(input: InvestmentAccountCreateInput, userId: string): Promise<InvestmentAccount> {
		const investmentAccountCount = await this.prisma.investmentAccount.count({
			where: {
				userId,
			},
		});

		// prevent creating more than 5 investment accounts per user
		if (investmentAccountCount > 4) {
			throw new HttpException(INVESTMENT_ACCOUNT_ERROR.NOT_ALLOWED_TO_CTEATE, HttpStatus.FORBIDDEN);
		}

		// create investment account
		const investmentAccount = await this.prisma.investmentAccount.create({
			data: {
				name: input.name,
				userId,
				holdings: [],
				cashChange: [],
			},
		});

		return investmentAccount;
	}

	async editInvestmentAccount(input: InvestmentAccountEditInput, userId: string): Promise<InvestmentAccount> {
		await this.isInvestmentAccountExist(input.investmentAccountId, userId);

		return this.prisma.investmentAccount.update({
			data: {
				name: input.name,
			},
			where: {
				id: input.investmentAccountId,
			},
		});
	}

	async deleteInvestmentAccount(investmentAccountId: string, userId: string): Promise<InvestmentAccount> {
		await this.isInvestmentAccountExist(investmentAccountId, userId);

		// remove investment account
		return this.prisma.investmentAccount.delete({
			where: {
				id: investmentAccountId,
			},
		});
	}

	/**
	 *
	 * @param investmentAccountId {string} id of the investment account we want to load
	 * @returns whether a investment account exists by the investmentAccountId
	 */
	private async isInvestmentAccountExist(investmentAccountId: string, userId: string): Promise<boolean> {
		const accountCount = await this.prisma.investmentAccount.count({
			where: {
				id: investmentAccountId,
				userId,
			},
		});

		// no account found to be deleted
		if (!accountCount || accountCount === 0) {
			throw new HttpException(INVESTMENT_ACCOUNT_ERROR.NOT_FOUND, HttpStatus.INTERNAL_SERVER_ERROR);
		}

		return accountCount > 0;
	}
}

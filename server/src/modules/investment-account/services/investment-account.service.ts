import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LodashServiceUtil, MomentServiceUtil, SharedServiceUtil } from '../../../utils';
import { AssetGeneralService } from '../../asset-manager';
import { INVESTMENT_ACCOUNT_ERROR, INVESTMENT_ACCOUNT_MAX } from '../dto';
import { InvestmentAccount, InvestmentAccountHolding, InvestmentAccountHoldingHistory } from '../entities';
import { InvestmentAccountCreateInput, InvestmentAccountEditInput, InvestmentAccountGrowthInput } from '../inputs';
import {
	InvestmentAccountActiveHoldingOutput,
	InvestmentAccountGrowth,
	InvestmentAccountTransactionOutput,
	InvestmentAccountTransactionWrapperOutput,
} from '../outputs';
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

	async getTransactions(
		investmentAccountId: string,
		userId: string
	): Promise<InvestmentAccountTransactionWrapperOutput> {
		const account = await this.getInvestmentAccountById(investmentAccountId, userId);

		// get every symbol holding history into arrya with existing return
		const history = account.holdings
			.map((d) => d.holdingHistory)
			.map((d) => d.filter((d) => !!d.return))
			.reduce((a, b) => [...a, ...b]);

		const bestValueChage = this.getTransactionsOrder(account, history, 'returnChange', 'desc');
		const bestValue = this.getTransactionsOrder(account, history, 'return', 'desc');
		const worstValueChage = this.getTransactionsOrder(account, history, 'returnChange', 'asc');
		const worstValue = this.getTransactionsOrder(account, history, 'return', 'asc');

		return { bestValueChage, bestValue, worstValue, worstValueChage };
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
		let cashAccumulated = investmentAccount.cashChange[cashChangeIndex]?.cashValue ?? 0;
		const cashGrowth = MomentServiceUtil.getDates(investmentAccount.cashChange[0]?.date, new Date()).map((d) => {
			const formattedDate = MomentServiceUtil.format(d);
			// reaching next cash entry, increase index and accumaltion
			if (formattedDate >= investmentAccount.cashChange[cashChangeIndex + 1]?.date) {
				cashChangeIndex += 1;
				cashAccumulated += investmentAccount.cashChange[cashChangeIndex].cashValue;
			}

			return {
				date: formattedDate,
				calculation: cashAccumulated,
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

	private getTransactionsOrder(
		investmentAccount: InvestmentAccount,
		history: InvestmentAccountHoldingHistory[],
		sortKey: 'returnChange' | 'return',
		orders: 'asc' | 'desc'
	): InvestmentAccountTransactionOutput[] {
		const result = LodashServiceUtil.orderBy(history, [sortKey], orders)
			.slice(0, 10)
			.map((d) => {
				const holding = investmentAccount.holdings.find((x) => x.assetId === d.assetId);
				const res: InvestmentAccountTransactionOutput = { ...d, holdingType: holding.type, sector: holding.sector };
				return res;
			});

		return result;
	}
}

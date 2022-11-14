import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma';
import { MomentServiceUtil, SharedServiceUtil } from '../../../utils';
import { AssetStockService } from '../../asset-manager';
import { INVESTMENT_ACCOUNT_HOLDING_ERROR, INVESTMENT_ACCOUNT_HOLDING_MAX_YEARS } from '../dto';
import { InvestmentAccount, InvestmentAccountHolding, InvestmentAccountHoldingHistory } from '../entities';
import { InvestmentAccounHoldingCreateInput, InvestmentAccounHoldingHistoryDeleteInput } from '../inputs';
import { InvestmentAccountService } from './investment-account.service';

@Injectable()
export class InvestmentAccountHoldingService {
	constructor(
		private prisma: PrismaService,
		private investmentAccountService: InvestmentAccountService,
		private assetStockService: AssetStockService
	) {}

	async modifyInvestmentAccountHolding(
		input: InvestmentAccounHoldingCreateInput,
		userId: string
	): Promise<InvestmentAccountHolding> {
		// do not allow selecting weekend for date
		if (MomentServiceUtil.isWeekend(input.holdingInputData.date)) {
			throw new HttpException(INVESTMENT_ACCOUNT_HOLDING_ERROR.IS_WEEKEND, HttpStatus.BAD_REQUEST);
		}

		// negative units
		if (input.holdingInputData.units < 0) {
			throw new HttpException(INVESTMENT_ACCOUNT_HOLDING_ERROR.MIN_UNIT_VALUE, HttpStatus.BAD_REQUEST);
		}

		// prevent adding future holdings
		if (MomentServiceUtil.format(new Date()) < MomentServiceUtil.format(input.holdingInputData.date)) {
			throw new HttpException(INVESTMENT_ACCOUNT_HOLDING_ERROR.UNSUPPORTRED_DATE_RANGE, HttpStatus.FORBIDDEN);
		}

		// get year data form input and today
		const { year: inputYear } = MomentServiceUtil.getDetailsInformationFromDate(input.holdingInputData.date);
		const { year: todayYear } = MomentServiceUtil.getDetailsInformationFromDate(new Date());

		// prevent lodaing more than N year of asset data or future data - just in case
		if (todayYear - inputYear > INVESTMENT_ACCOUNT_HOLDING_MAX_YEARS) {
			throw new HttpException(INVESTMENT_ACCOUNT_HOLDING_ERROR.UNSUPPORTRED_DATE_RANGE, HttpStatus.FORBIDDEN);
		}

		let assetSecotor = input.type.toString();

		// load and save assets data into the DB
		if (input.type === 'STOCK') {
			const stock = await this.assetStockService.refreshStockIntoDatabase(input.symbol);
			// stocks was a different sectory type
			assetSecotor = stock.profile.sector;
		}

		// load investment account to which we want to create the holding
		const investmentAccount = await this.investmentAccountService.getInvestmentAccountById(
			input.investmentAccountId,
			userId
		);

		// find existing holding
		const existingHolding = investmentAccount.holdings.find((x) => x.id === input.symbol);
		const existingHoldingHistories = existingHolding?.holdingHistory ?? [];

		// create DB object
		const newHoldingHistory: InvestmentAccountHoldingHistory = {
			itemId: SharedServiceUtil.getUUID(),
			units: input.holdingInputData.units,
			investedAmount: input.holdingInputData.investedAmount,
			date: MomentServiceUtil.format(input.holdingInputData.date),
			createdAt: new Date(),
		};

		// merge and sort ASC, because user may add newHoldingHistory sooner than existingHoldingHistories[-1]
		const mergedHoldingHistory = [...existingHoldingHistories, newHoldingHistory].sort((a, b) =>
			MomentServiceUtil.isBefore(a.date, b.date) ? -1 : 1
		);

		// holding may already exists or create new one
		const modifiedHolding = !!existingHolding
			? this.modifyExistingHoldingWithHistory(investmentAccount, input.symbol, mergedHoldingHistory)
			: this.createNewHoldingWithHistory(investmentAccount, input, mergedHoldingHistory, assetSecotor);

		return modifiedHolding;
	}

	/**
	 * Removes a matching itemId from InvestmentAccountHolding and returns it
	 *
	 * @param input
	 */
	async deleteHoldingHistory(
		input: InvestmentAccounHoldingHistoryDeleteInput,
		userId: string
	): Promise<InvestmentAccountHoldingHistory> {
		// load investment account
		const investmentAccount = await this.investmentAccountService.getInvestmentAccountById(
			input.investmentAccountId,
			userId
		);

		// find existing holding
		const existingHoldingIndex = investmentAccount.holdings.findIndex((x) => x.id === input.symbol);

		// should not happen what we don't have a holding when removing a history
		if (existingHoldingIndex === -1) {
			throw new HttpException(INVESTMENT_ACCOUNT_HOLDING_ERROR.NOT_FOUND, HttpStatus.NOT_FOUND);
		}

		const existingHolding = investmentAccount.holdings[existingHoldingIndex];
		const removedHoldingHistory = existingHolding.holdingHistory.find((d) => d.itemId === input.itemId);

		// replace holding history for matching symbol
		const modifiedHoldings = investmentAccount.holdings.map((d) => {
			if (d.id === input.symbol) {
				return { ...d, holdingHistory: existingHolding.holdingHistory.filter((d) => d.itemId !== input.itemId) };
			}
			return d;
		});

		// Save holding to the DB
		await this.prisma.investmentAccount.update({
			data: {
				holdings: [...modifiedHoldings],
			},
			where: {
				id: investmentAccount.id,
			},
		});

		// returned removed history
		return removedHoldingHistory;
	}

	/**
	 * Change mergedHoldingHistory for an existing symbol in investmentAccount.holdings
	 *
	 * @param investmentAccount
	 * @param symbol
	 * @param mergedHoldingHistory
	 * @returns
	 */
	private async modifyExistingHoldingWithHistory(
		investmentAccount: InvestmentAccount,
		symbol: string,
		mergedHoldingHistory: InvestmentAccountHoldingHistory[]
	): Promise<InvestmentAccountHolding> {
		// replace holding history for matching symbol
		const modifiedHoldings = investmentAccount.holdings.map((d) => {
			if (d.id === symbol) {
				return { ...d, holdingHistory: mergedHoldingHistory };
			}
			return d;
		});

		// find holding that was modified
		const modifiedHolding = modifiedHoldings.find((d) => d.assetId === symbol);

		if (!modifiedHolding) {
			throw new Error('InvestmentAccountHoldingService.modifyExistingHoldingWithHistory(), holding not found');
		}

		// save data into DB
		await this.updateInvestmenAccountHolding(investmentAccount.id, modifiedHoldings);

		return modifiedHolding;
	}

	/**
	 * Create new holding for input.symbol and adds mergedHoldingHistory, that is
	 * just an array of 1 element
	 *
	 * @param investmentAccount
	 * @param input
	 * @param mergedHoldingHistory
	 * @param assetSecotor
	 * @returns
	 */
	private async createNewHoldingWithHistory(
		investmentAccount: InvestmentAccount,
		input: InvestmentAccounHoldingCreateInput,
		mergedHoldingHistory: InvestmentAccountHoldingHistory[],
		assetSecotor: string
	): Promise<InvestmentAccountHolding> {
		// create new holding
		const holding: InvestmentAccountHolding = {
			id: input.symbol,
			investmentAccountId: input.investmentAccountId,
			assetId: input.symbol,
			type: input.type,
			sector: assetSecotor,
			holdingHistory: [...mergedHoldingHistory],
		};

		// save entity
		const modifiedHoldings = [...investmentAccount.holdings, holding];
		await this.updateInvestmenAccountHolding(input.investmentAccountId, modifiedHoldings);

		return holding;
	}

	private updateInvestmenAccountHolding(
		investmenAccountId: string,
		holdings: InvestmentAccountHolding[]
	): Promise<InvestmentAccount> {
		return this.prisma.investmentAccount.update({
			data: {
				holdings: [...holdings],
			},
			where: {
				id: investmenAccountId,
			},
		});
	}
}

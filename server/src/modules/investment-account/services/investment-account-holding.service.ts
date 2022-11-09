import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma';
import { AssetGeneralService, AssetStockService } from '../../asset-manager';
import { INVESTMENT_ACCOUNT_HOLDING_ERROR } from '../dto';
import { InvestmentAccount, InvestmentAccountHolding, InvestmentAccountHoldingHistory } from '../entities';
import { InvestmentAccounHoldingCreateInput, InvestmentAccounHoldingHistoryDeleteInput } from '../inputs';
import { MomentServiceUtil, SharedServiceUtil } from './../../../utils';
import { InvestmentAccountService } from './investment-account.service';

@Injectable()
export class InvestmentAccountHoldingService {
	constructor(
		private prisma: PrismaService,
		private investmentAccountService: InvestmentAccountService,
		private assetGeneralService: AssetGeneralService,
		private assetStockService: AssetStockService
	) {}

	async modifyInvestmentAccountHolding(
		input: InvestmentAccounHoldingCreateInput,
		userId: string
	): Promise<InvestmentAccountHolding> {
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

		// get year data form input and today
		const { year: inputYear } = MomentServiceUtil.getDetailsInformationFromDate(input.holdingInputData.date);
		const { year: todayYear } = MomentServiceUtil.getDetailsInformationFromDate(new Date());

		// prevent lodaing more than 5 year of stock data or future data - just in case
		if (inputYear > todayYear || todayYear - inputYear > 5) {
			throw new HttpException(INVESTMENT_ACCOUNT_HOLDING_ERROR.UNSUPPORTRED_DATE_RANGE, HttpStatus.FORBIDDEN);
		}

		// refresh symbol data & historical loaded prices
		await Promise.all([
			this.assetGeneralService.refreshAssetIntoDatabase(input.symbol),
			this.assetGeneralService.refreshHistoricalPriceIntoDatabase(
				input.symbol,
				input.holdingInputData.date,
				MomentServiceUtil.format(new Date())
			),
		]);

		// find existing holding
		const existingHolding = investmentAccount.holdings.find((x) => x.id === input.symbol);
		const existingHoldingHistories = existingHolding?.holdingHistory ?? [];

		// create DB object
		const newHoldingHistory: InvestmentAccountHoldingHistory = {
			itemId: SharedServiceUtil.getUUID(),
			units: input.holdingInputData.units,
			investedAmount: input.holdingInputData.investedAmount,
			date: MomentServiceUtil.format(input.holdingInputData.date),
		};

		// merge and sort ASC, because user may add newHoldingHistory sooner than existingHoldingHistories[-1]
		const mergedHoldingHistory = [...existingHoldingHistories, newHoldingHistory].sort((a, b) =>
			MomentServiceUtil.isBefore(a.date, b.date) ? 1 : -1
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
		const existingHolding = investmentAccount.holdings.find((x) => x.id === input.symbol);

		// should not happen what we don't have a holding when removing a history
		if (!existingHolding) {
			throw new Error(
				`InvestmentAccountHoldingService.deleteHoldingHistory, holding not found for symbol ${input.symbol}`
			);
		}

		const modifiedHoldingHistories = existingHolding.holdingHistory.filter((d) => d.itemId !== input.itemId);
		const removedHoldingHistory = existingHolding.holdingHistory.find((d) => d.itemId === input.itemId);

		// save data into DB
		this.modifyExistingHoldingWithHistory(investmentAccount, input.symbol, modifiedHoldingHistories);

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
	private modifyExistingHoldingWithHistory(
		investmentAccount: InvestmentAccount,
		symbol: string,
		mergedHoldingHistory: InvestmentAccountHoldingHistory[]
	): InvestmentAccountHolding {
		// replace holding history for matching symbol
		const modifiedHoldings = investmentAccount.holdings.map((d) => {
			if (d.id === symbol) {
				return { ...d, holdingHistory: mergedHoldingHistory };
			}
			return d;
		});

		// find holding that was modified
		const modifiedHolding = investmentAccount.holdings.find((d) => d.assetId === symbol);

		if (!modifiedHolding) {
			throw new Error('InvestmentAccountHoldingService.modifyExistingHoldingWithHistory(), holding not found');
		}

		// save data into DB
		this.updateInvestmenAccountHolding(investmentAccount.id, modifiedHoldings);

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
	private createNewHoldingWithHistory(
		investmentAccount: InvestmentAccount,
		input: InvestmentAccounHoldingCreateInput,
		mergedHoldingHistory: InvestmentAccountHoldingHistory[],
		assetSecotor: string
	): InvestmentAccountHolding {
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
		this.updateInvestmenAccountHolding(input.investmentAccountId, modifiedHoldings);

		return holding;
	}

	private updateInvestmenAccountHolding(investmenAccountId: string, holdings: InvestmentAccountHolding[]): void {
		this.prisma.investmentAccount.update({
			data: {
				holdings: [...holdings],
			},
			where: {
				id: investmenAccountId,
			},
		});
	}
}

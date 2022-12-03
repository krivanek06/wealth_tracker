import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InvestmentAccountHoldingHistoryType, InvestmentAccountHoldingType } from '@prisma/client';
import { MomentServiceUtil, SharedServiceUtil } from '../../../utils';
import { AssetGeneralService, AssetStockService } from '../../asset-manager';
import { INVESTMENT_ACCOUNT_HOLDING_ERROR, INVESTMENT_ACCOUNT_HOLDING_MAX_YEARS } from '../dto';
import { InvestmentAccount, InvestmentAccountHolding, InvestmentAccountHoldingHistory } from '../entities';
import {
	InvestmentAccounHoldingCreateInput,
	InvestmentAccounHoldingHistoryDeleteInput,
	InvestmentAccountCashCreateInput,
} from '../inputs';
import { InvestmentAccountActiveHoldingOutput, InvestmentAccountTransactionOutput } from '../outputs';
import { InvestmentAccountCashChangeService } from './investment-account-cache-change.service';
import { InvestmentAccountRepositoryService } from './investment-account-repository.service';

@Injectable()
export class InvestmentAccountHoldingService {
	constructor(
		private investmentAccountRepositoryService: InvestmentAccountRepositoryService,
		private assetStockService: AssetStockService,
		private assetGeneralService: AssetGeneralService,
		private investmentAccountCashChangeService: InvestmentAccountCashChangeService
	) {}

	filterOutActiveHoldings(account: InvestmentAccount): InvestmentAccountHolding[] {
		return account.holdings.filter(
			(d) =>
				d.holdingHistory.reduce(
					(acc, curr) => acc + (curr.type === InvestmentAccountHoldingHistoryType.BUY ? curr.units : -curr.units),
					0
				) > 0
		);
	}

	async createInvestmentAccountHolding(
		input: InvestmentAccounHoldingCreateInput,
		userId: string
	): Promise<{ holding: InvestmentAccountHolding; transaction: InvestmentAccountTransactionOutput }> {
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

		// prevent loading more than N year of asset data or future data - just in case
		if (todayYear - inputYear > INVESTMENT_ACCOUNT_HOLDING_MAX_YEARS) {
			throw new HttpException(INVESTMENT_ACCOUNT_HOLDING_ERROR.UNSUPPORTRED_DATE_RANGE, HttpStatus.FORBIDDEN);
		}

		// load investment account to which we want to create the holding
		const investmentAccount = await this.investmentAccountRepositoryService.getInvestmentAccountById(
			input.investmentAccountId,
			userId
		);

		// find existing holding
		const existingHolding = investmentAccount.holdings.find((x) => x.id === input.symbol);
		const existingHoldingHistories = existingHolding?.holdingHistory ?? [];

		// calculate BEP by which we will create return & returnChange
		const bepHelpers = existingHoldingHistories
			// get only BUY holdings that happened sooner than input.holdingInputData.date
			.filter((d) => d.date < input.holdingInputData.date && d.type === 'BUY')
			.reduce(
				(acc, curr) => {
					const multy = curr.type === 'BUY' ? 1 : -1;
					return { units: acc.units + curr.units * multy, value: acc.value + curr.unitValue * curr.units * multy };
				},
				{ units: 0, value: 0 } as { units: number; value: number }
			);

		// first entry cannot be sell
		if (input.type === 'SELL' && bepHelpers.units < input.holdingInputData.units) {
			throw new HttpException(INVESTMENT_ACCOUNT_HOLDING_ERROR.SELL_ERROR_NO_HOLDING, HttpStatus.FORBIDDEN);
		}

		// load symbol value on holdingInputData.date
		const closedValueApi = (
			await this.assetGeneralService.getAssetGeneralHistoricalPricesDataOnDate(
				input.symbol,
				input.holdingInputData.date
			)
		)?.close;

		// save cash change -> if SELL add cash / if BUY subtract cash
		const cashInput: InvestmentAccountCashCreateInput = {
			investmentAccountId: input.investmentAccountId,
			type: 'ASSET_OPERATION',
			date: input.holdingInputData.date,
			cashValue: input.holdingInputData.units * closedValueApi * (input.type === 'SELL' ? 1 : -1),
		};

		// save cash
		const savedCash = await this.investmentAccountCashChangeService.createInvestmentAccountCashe(cashInput, userId);

		// calculate return & returnChange if Sell operation
		const breakEvenPrice = SharedServiceUtil.roundDec(bepHelpers.value / bepHelpers.units);
		const inputUnits = input.holdingInputData.units;
		const returnValue =
			input.type === 'SELL' ? SharedServiceUtil.roundDec((breakEvenPrice - closedValueApi) * inputUnits) : null;
		const returnChange =
			input.type === 'SELL' ? SharedServiceUtil.roundDec((breakEvenPrice - closedValueApi) / closedValueApi, 4) : null;

		// create DB object
		const newHoldingHistory: InvestmentAccountHoldingHistory = {
			itemId: SharedServiceUtil.getUUID(),
			units: inputUnits,
			type: input.type,
			unitValue: SharedServiceUtil.roundDec(closedValueApi),
			date: MomentServiceUtil.format(input.holdingInputData.date),
			createdAt: new Date(),
			return: returnValue,
			returnChange: returnChange,
			cashChangeId: savedCash.itemId,
			assetId: input.symbol,
		};

		// merge and sort ASC, because user may add newHoldingHistory sooner than existingHoldingHistories[-1]
		const mergedHoldingHistory = [...existingHoldingHistories, newHoldingHistory].sort((a, b) =>
			MomentServiceUtil.isBefore(a.date, b.date) ? -1 : 1
		);

		// get holding type and sector
		const [holdingType, assetSector] = await this.getSectorAllocation(input.symbol, input.isCrypto);

		// create returning InvestmentAccountTransactionOutput
		const transaction: InvestmentAccountTransactionOutput = {
			...newHoldingHistory,
			holdingType: holdingType,
			sector: assetSector,
		};

		// holding may already exists or create new one
		const modifiedHolding = !!existingHolding
			? await this.modifyExistingHoldingWithHistory(investmentAccount, input.symbol, mergedHoldingHistory)
			: await this.createNewHoldingWithHistory(
					investmentAccount,
					input,
					mergedHoldingHistory,
					holdingType,
					assetSector
			  );

		return { holding: modifiedHolding, transaction };
	}

	/**
	 * Removes a matching itemId from InvestmentAccountHolding and returns it
	 * @param input
	 */
	async deleteHoldingHistory(
		input: InvestmentAccounHoldingHistoryDeleteInput,
		userId: string
	): Promise<InvestmentAccountHoldingHistory> {
		// load investment account
		const investmentAccount = await this.investmentAccountRepositoryService.getInvestmentAccountById(
			input.investmentAccountId,
			userId
		);

		// find existing holding
		const existingHoldingIndex = investmentAccount.holdings.findIndex((x) => x.id === input.symbol);

		// should not happen what we don't have a holding when removing a history
		if (existingHoldingIndex === -1) {
			throw new HttpException(INVESTMENT_ACCOUNT_HOLDING_ERROR.NOT_FOUND, HttpStatus.NOT_FOUND);
		}

		const symbolHoldingHistory = investmentAccount.holdings[existingHoldingIndex].holdingHistory;
		const removedHoldingHistoryIndex = symbolHoldingHistory.findIndex((d) => d.itemId === input.itemId);

		// trying to remove unexisting holdingHistory
		if (removedHoldingHistoryIndex === -1) {
			throw new HttpException(INVESTMENT_ACCOUNT_HOLDING_ERROR.NOT_FOUND, HttpStatus.NOT_FOUND);
		}
		// holdingHistory that will be removed
		const removedHoldingHistory = symbolHoldingHistory[removedHoldingHistoryIndex];

		// prevent removing a 'BUY' option if the next following SELL operation removes more symbols than we delete
		// get the index of the next 'SELL' operation after removedHoldingHistoryIndex if there is any
		const nextSellIndex = symbolHoldingHistory.findIndex(
			(d, index) => index > removedHoldingHistoryIndex && d.type === 'SELL'
		);

		// removing a BUY operation and we have a SELL operation after it
		if (removedHoldingHistory.type === 'BUY' && nextSellIndex !== -1) {
			const nextSellHoldingHistory = symbolHoldingHistory[nextSellIndex];
			// get total units up until nextSellIndex
			const currentUnits = symbolHoldingHistory
				.filter((_, index) => index < nextSellIndex)
				.reduce((acc, curr) => acc + (curr.type === 'BUY' ? curr.units : -curr.units), 0);

			// if removing BUY operation units if less than next SELL operation, throw error
			if (currentUnits - removedHoldingHistory.units < nextSellHoldingHistory.units) {
				throw new HttpException(INVESTMENT_ACCOUNT_HOLDING_ERROR.UNABLE_TO_DELETE_HISTORY, HttpStatus.NOT_FOUND);
			}
		}

		// remove cash change
		await this.investmentAccountCashChangeService.deleteInvestmentAccountCash(
			{
				investmentAccountId: input.investmentAccountId,
				itemId: removedHoldingHistory.cashChangeId,
			},
			userId
		);

		// replace holding history for matching symbol
		const modifiedHoldings = investmentAccount.holdings.map((d) => {
			if (d.id === input.symbol) {
				return { ...d, holdingHistory: symbolHoldingHistory.filter((d) => d.itemId !== input.itemId) };
			}
			return d;
		});

		// save entity
		await this.investmentAccountRepositoryService.updateInvestmentAccount(investmentAccount.id, {
			holdings: modifiedHoldings,
		});

		// returned removed history
		return removedHoldingHistory;
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
			const beakEvenPrice = units !== 0 ? SharedServiceUtil.roundDec(totalValue / units) : 0;

			const assetGeneral = activeHoldingAssetGeneral.find((asset) => asset.id === holding.assetId);
			const merge: InvestmentAccountActiveHoldingOutput = {
				id: holding.id,
				assetId: holding.assetId,
				type: holding.type,
				sector: holding.sector,
				investmentAccountId: holding.investmentAccountId,
				assetGeneral,
				totalValue: units !== 0 ? totalValue : 0,
				units,
				beakEvenPrice,
			};
			return merge;
		});

		return result;
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

		// save entity
		await this.investmentAccountRepositoryService.updateInvestmentAccount(investmentAccount.id, {
			holdings: modifiedHoldings,
		});

		return modifiedHolding;
	}

	/**
	 * Create new holding for input.symbol and adds mergedHoldingHistory, that is
	 * just an array of 1 element
	 *
	 * @param investmentAccount
	 * @param input
	 * @param mergedHoldingHistory
	 * @param assetSector
	 * @returns
	 */
	private async createNewHoldingWithHistory(
		investmentAccount: InvestmentAccount,
		input: InvestmentAccounHoldingCreateInput,
		mergedHoldingHistory: InvestmentAccountHoldingHistory[],
		holdingType: InvestmentAccountHoldingType,
		assetSector: string
	): Promise<InvestmentAccountHolding> {
		// create new holding
		const holding: InvestmentAccountHolding = {
			id: input.symbol,
			investmentAccountId: input.investmentAccountId,
			assetId: input.symbol,
			type: holdingType,
			sector: assetSector,
			holdingHistory: [...mergedHoldingHistory],
		};

		// save entity
		await this.investmentAccountRepositoryService.updateInvestmentAccount(input.investmentAccountId, {
			holdings: [...investmentAccount.holdings, holding],
		});

		return holding;
	}

	private async getSectorAllocation(
		symbol: string,
		isCrypto: boolean
	): Promise<[InvestmentAccountHoldingType, string]> {
		if (isCrypto) {
			return [InvestmentAccountHoldingType.CRYPTO, InvestmentAccountHoldingType.CRYPTO];
		}
		const assetGeneral = await this.assetStockService.refreshStockIntoDatabase(symbol);

		if (assetGeneral.profile.isAdr) {
			return [InvestmentAccountHoldingType.ADR, assetGeneral.profile.sector ?? InvestmentAccountHoldingType.ADR];
		}
		if (assetGeneral.profile.isEtf) {
			return [InvestmentAccountHoldingType.ETF, InvestmentAccountHoldingType.ETF];
		}
		if (assetGeneral.profile.isFund) {
			return [InvestmentAccountHoldingType.MUTUAL_FUND, InvestmentAccountHoldingType.MUTUAL_FUND];
		}

		return [InvestmentAccountHoldingType.STOCK, assetGeneral.profile.sector];
	}
}

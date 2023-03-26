import { Injectable } from '@nestjs/common';
import { LodashServiceUtil } from '../../../utils';
import { INVESTMENT_ACCOUNT_SEARCH_LIMITS } from '../dto';
import { InvestmentAccount, InvestmentAccountHoldingHistory } from '../entities';
import { InvestmentAccountTransactionInput, InvestmentAccountTransactionInputOrderType } from '../inputs';
import { InvestmentAccountTransactionOutput, InvestmentAccountTransactionWrapperOutput } from '../outputs';
import { InvestmentAccountRepositoryService } from './investment-account-repository.service';

@Injectable()
export class InvestmentAccountTransactionService {
	constructor(private investmentAccountRepositoryService: InvestmentAccountRepositoryService) {}

	/**
	 *
	 * @param accountId
	 * @param userId
	 * @returns array of symbols located in the transaction history. Used for filtering transaction history by symbols
	 */
	async getTransactionSymbols(userId: string): Promise<string[]> {
		const account = await this.investmentAccountRepositoryService.getInvestmentAccountByUserIdStrict(userId);
		const history = account.holdings
			.map((d) => d.holdingHistory)
			.reduce((a, b) => [...a, ...b], [])
			.map((d) => d.assetId);

		return [...new Set(history)];
	}

	async getTopTransactions(userId: string): Promise<InvestmentAccountTransactionWrapperOutput> {
		const account = await this.investmentAccountRepositoryService.getInvestmentAccountByUserIdStrict(userId);

		// get every symbol holding history into array with existing return
		const history = account.holdings
			.map((d) => d.holdingHistory)
			.map((d) => d.filter((d) => !!d.return))
			.reduce((a, b) => [...a, ...b]);

		const bestValueChange = this.getTransactionsOrder(account, history, 'returnChange', 'desc');
		const bestValue = this.getTransactionsOrder(account, history, 'return', 'desc');
		const worstValueChange = this.getTransactionsOrder(account, history, 'returnChange', 'asc');
		const worstValue = this.getTransactionsOrder(account, history, 'return', 'asc');

		return { bestValueChange, bestValue, worstValue, worstValueChange };
	}

	async getTransactionHistory(
		input: InvestmentAccountTransactionInput,
		userId: string
	): Promise<InvestmentAccountTransactionOutput[]> {
		const account = await this.investmentAccountRepositoryService.getInvestmentAccountByUserIdStrict(userId);

		// filter out valid holdings
		const history = account.holdings
			.map((d) =>
				d.holdingHistory.filter(
					(holding) => input.filterSymbols.length === 0 || input.filterSymbols.includes(holding.assetId)
				)
			)
			.reduce((a, b) => [...a, ...b], [])
			.filter((d) => (input.includeBuyOperation ? true : d.type === 'SELL'));

		const order = input.orderAsc ? 'asc' : 'desc';
		const offset = input.offset;
		const limit = input.offset + INVESTMENT_ACCOUNT_SEARCH_LIMITS;

		if (input.orderType === InvestmentAccountTransactionInputOrderType.ORDER_BY_VALUE) {
			return this.getTransactionsOrder(account, history, 'return', order, offset, limit);
		}
		if (input.orderType === InvestmentAccountTransactionInputOrderType.ORDER_BY_VALUE_CHANGE) {
			return this.getTransactionsOrder(account, history, 'returnChange', order, offset, limit);
		}
		if (input.orderType === InvestmentAccountTransactionInputOrderType.ORDER_BY_CREATED_AT) {
			return this.getTransactionsOrder(account, history, 'createdAt', order, offset, limit);
		}

		return this.getTransactionsOrder(account, history, 'date', order, offset, limit);
	}

	private getTransactionsOrder(
		investmentAccount: InvestmentAccount,
		history: InvestmentAccountHoldingHistory[],
		sortKey: keyof InvestmentAccountHoldingHistory,
		orders: 'asc' | 'desc',
		offset = 0,
		limit = 10
	): InvestmentAccountTransactionOutput[] {
		const result = LodashServiceUtil.orderBy(history, [sortKey], orders)
			.slice(offset, limit)
			.map((d) => {
				const holding = investmentAccount.holdings.find((x) => x.assetId === d.assetId);
				const res: InvestmentAccountTransactionOutput = { ...d, holdingType: holding.type, sector: holding.sector };
				return res;
			});

		return result;
	}
}

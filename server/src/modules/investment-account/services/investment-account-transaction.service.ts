import { Injectable } from '@nestjs/common';
import { LodashServiceUtil } from '../../../utils';
import { INVESTMENT_ACCOUNT_SEARCH_LIMIS } from '../dto';
import { InvestmentAccount, InvestmentAccountHoldingHistory } from '../entities';
import { InvestmentAccountTransactionInput, InvestmentAccountTransactionInputOrderType } from '../inputs';
import { InvestmentAccountTransactionOutput, InvestmentAccountTransactionWrapperOutput } from '../outputs';
import { InvestmentAccountRepositoryService } from './investment-account-repository.service';

@Injectable()
export class InvestmentAccountTransactionService {
	constructor(private investmentAccountRepositoryService: InvestmentAccountRepositoryService) {}

	async getTransactionSymbols(accountId: string, userId: string): Promise<string[]> {
		const account = await this.investmentAccountRepositoryService.getInvestmentAccountById(accountId, userId);
		const history = account.holdings
			.map((d) => d.holdingHistory)
			.reduce((a, b) => [...a, ...b])
			.map((d) => d.assetId);

		return [...new Set(history)];
	}

	async getTopTransactions(accountId: string, userId: string): Promise<InvestmentAccountTransactionWrapperOutput> {
		const account = await this.investmentAccountRepositoryService.getInvestmentAccountById(accountId, userId);

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

	async getTransactionHistory(
		input: InvestmentAccountTransactionInput,
		userId: string
	): Promise<InvestmentAccountTransactionOutput[]> {
		const account = await this.investmentAccountRepositoryService.getInvestmentAccountById(input.accountId, userId);

		// filter out valid holdings
		const history = account.holdings
			.map((d) =>
				d.holdingHistory.filter(
					(holding) => input.filterSymbols.length === 0 || input.filterSymbols.includes(holding.assetId)
				)
			)
			.reduce((a, b) => [...a, ...b])
			.filter((d) => (input.includeBuyOperation ? true : d.type === 'SELL'));

		const order = input.orderAsc ? 'asc' : 'desc';
		const offest = input.offset;
		const limit = input.offset + INVESTMENT_ACCOUNT_SEARCH_LIMIS;

		if (input.orderType === InvestmentAccountTransactionInputOrderType.ORDER_BY_VALUE) {
			return this.getTransactionsOrder(account, history, 'return', order, offest, limit);
		}
		if (input.orderType === InvestmentAccountTransactionInputOrderType.ORDER_BY_VALUE_CHANGE) {
			return this.getTransactionsOrder(account, history, 'returnChange', order, offest, limit);
		}
		if (input.orderType === InvestmentAccountTransactionInputOrderType.ORDER_BY_CREATED_AT) {
			return this.getTransactionsOrder(account, history, 'createdAt', order, offest, limit);
		}

		return this.getTransactionsOrder(account, history, 'date', order, offest, limit);
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

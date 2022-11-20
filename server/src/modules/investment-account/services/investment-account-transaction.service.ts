import { Injectable } from '@nestjs/common';
import { LodashServiceUtil } from '../../../utils';
import { INVESTMENT_ACCOUNT_SEARCH_LIMIS } from '../dto';
import { InvestmentAccount, InvestmentAccountHoldingHistory } from '../entities';
import { InvestmentAccountTransactionInput } from '../inputs';
import { InvestmentAccountTransactionOutput, InvestmentAccountTransactionWrapperOutput } from '../outputs';
import { InvestmentAccountRepositoryService } from './investment-account-repository.service';

@Injectable()
export class InvestmentAccountTransactionService {
	constructor(private investmentAccountRepositoryService: InvestmentAccountRepositoryService) {}

	async getTransactions(accountId: string, userId: string): Promise<InvestmentAccountTransactionWrapperOutput> {
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

		const transactionOuput = account.holdings
			.map((d) => d.holdingHistory)
			.reduce((a, b) => [...a, ...b])
			.sort((a, b) => {
				if (input.orderByCreatedAt) {
					return b.createdAt.getTime() - a.createdAt.getTime();
				}
				return a.date < b.date ? 1 : -1;
			})
			.slice(input.offset, input.offset + INVESTMENT_ACCOUNT_SEARCH_LIMIS)
			.map((d) => {
				const holding = account.holdings.find((x) => x.assetId === d.assetId);
				const res: InvestmentAccountTransactionOutput = { ...d, holdingType: holding.type, sector: holding.sector };
				return res;
			});

		return transactionOuput;
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

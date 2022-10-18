import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { INVESTMENT_ACCOUNT_ERROR } from '../dto';
import { InvestmentAccount } from '../entities';
import { InvestmentAccountCreateInput, InvestmentAccountEditInput } from '../inputs';
import { PrismaService } from './../../../prisma';
import { InvestmentAccountHistoryService } from './investment-account-history.service';

@Injectable()
export class InvestmentAccountService {
	constructor(
		private prisma: PrismaService,
		private investmentAccountHistoryService: InvestmentAccountHistoryService
	) {}

	getInvestmentAccounts(userId: string): Promise<InvestmentAccount[]> {
		return this.prisma.investmentAccount.findMany({
			where: {
				userId,
			},
		});
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
				lastPortfolioSnapshot: null,
				cashCurrent: 0,
			},
		});

		// create history for investment account
		await this.investmentAccountHistoryService.createInvestmentAccountHistory(investmentAccount);

		return investmentAccount;
	}

	async editInvestmentAccount(input: InvestmentAccountEditInput, userId: string): Promise<InvestmentAccount> {
		const isInvestmentAccountExist = await this.isInvestmentAccountExist(input.investmentAccountId, userId);

		// no account found to be deleted
		if (!isInvestmentAccountExist) {
			throw new HttpException(INVESTMENT_ACCOUNT_ERROR.NOT_FOUND, HttpStatus.INTERNAL_SERVER_ERROR);
		}

		return this.prisma.investmentAccount.update({
			data: {
				name: input.name,
				cashCurrent: input.cashCurrent,
			},
			where: {
				id: input.investmentAccountId,
			},
		});
	}

	async deleteInvestmentAccount(investmentAccountId: string, userId: string): Promise<InvestmentAccount> {
		const isInvestmentAccountExist = await this.isInvestmentAccountExist(investmentAccountId, userId);

		// no account found to be deleted
		if (!isInvestmentAccountExist) {
			throw new HttpException(INVESTMENT_ACCOUNT_ERROR.NOT_FOUND, HttpStatus.INTERNAL_SERVER_ERROR);
		}

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

		return accountCount > 0;
	}
}

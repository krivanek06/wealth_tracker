import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { INVESTMENT_ACCOUNT_ERROR } from '../dto';
import { InvestmentAccount } from '../entities';
import { InvestmentAccountCreateInput } from '../inputs';
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
				cashCurrent: 0,
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
			},
		});

		// create history for investment account
		await this.investmentAccountHistoryService.createInvestmentAccountHistory(investmentAccount);

		return investmentAccount;
	}
}

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { PrismaService } from '../../../prisma';
import { INVESTMENT_ACCOUNT_ERROR } from '../dto';
import { InvestmentAccount } from '../entities';

@Injectable()
export class InvestmentAccountRepositoryService {
	constructor(private prisma: PrismaService) {}

	getInvestmentAccounts(userId: string): Promise<InvestmentAccount[]> {
		return this.prisma.investmentAccount.findMany({
			where: {
				userId,
			},
		});
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

	createInvestmentAccount(name: string, userId: string): Promise<InvestmentAccount> {
		return this.prisma.investmentAccount.create({
			data: {
				name,
				userId,
				accountType: AccountType.INVESTMENT_ACCOUNT,
				holdings: [],
				cashChange: [],
			},
		});
	}

	updateInvestmentAccount(accountId: string, data: Partial<InvestmentAccount>): Promise<InvestmentAccount> {
		return this.prisma.investmentAccount.update({
			data: {
				...data,
			},
			where: {
				id: accountId,
			},
		});
	}

	countInvestmentAccounts(userId: string): Promise<number> {
		return this.prisma.investmentAccount.count({
			where: {
				userId,
			},
		});
	}

	deleteInvestmentAccount(investmentAccountId: string): Promise<InvestmentAccount> {
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
	async isInvestmentAccountExist(investmentAccountId: string, userId: string): Promise<boolean> {
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

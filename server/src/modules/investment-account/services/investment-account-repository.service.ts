import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { PrismaService } from '../../../prisma';
import { INVESTMENT_ACCOUNT_ERROR } from '../dto';
import { InvestmentAccount } from '../entities';

@Injectable()
export class InvestmentAccountRepositoryService {
	constructor(private prisma: PrismaService) {}

	getInvestmentAccountByUserId(userId: string): Promise<InvestmentAccount | undefined> {
		return this.prisma.investmentAccount.findUnique({
			where: {
				userId,
			},
		});
	}

	async getInvestmentAccountByUserIdStrict(userId: string): Promise<InvestmentAccount> {
		const investmentAccount = await this.prisma.investmentAccount.findUnique({
			where: {
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
				accountType: AccountType.INVESTMENT,
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

	deleteInvestmentAccount(userId: string): Promise<InvestmentAccount> {
		return this.prisma.investmentAccount.delete({
			where: {
				userId,
			},
		});
	}
}

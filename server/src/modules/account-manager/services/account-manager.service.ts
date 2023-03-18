import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma';
import { AccountIdentification } from '../entities';

@Injectable()
export class AccountManager {
	constructor(private prisma: PrismaService) {}

	async getAvailableAccounts(userId: string): Promise<AccountIdentification[]> {
		const personal = this.getPersonalAccountByUserId(userId);
		const investment = this.getInvestmentAccountByUserId(userId);

		const data = await Promise.all([personal, investment]);

		// filter out null values
		const filtered = data.filter((d) => !!d);
		return filtered;
	}

	private getPersonalAccountByUserId(userId: string): Promise<AccountIdentification | undefined> {
		return this.prisma.personalAccount.findUnique({
			where: {
				userId,
			},
		});
	}

	private getInvestmentAccountByUserId(userId: string): Promise<AccountIdentification | undefined> {
		return this.prisma.investmentAccount.findUnique({
			where: {
				userId,
			},
		});
	}
}

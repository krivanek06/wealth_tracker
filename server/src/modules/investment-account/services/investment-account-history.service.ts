import { Injectable } from '@nestjs/common';
import { InvestmentAccountHistory } from '@prisma/client';
import { PrismaService } from '../../../prisma';
import { InvestmentAccount } from '../entities';

@Injectable()
export class InvestmentAccountHistoryService {
	constructor(private prisma: PrismaService) {}

	getInvestmentAccountHistoryInvestmentAccount({ id }: InvestmentAccount): Promise<InvestmentAccountHistory> {
		return this.prisma.investmentAccountHistory.findFirst({
			where: {
				investmentAccountId: id,
			},
		});
	}

	createInvestmentAccountHistory({ id }: InvestmentAccount): Promise<InvestmentAccountHistory> {
		return this.prisma.investmentAccountHistory.create({
			data: {
				investmentAccountId: id,
				portfolioSnapshotTotal: 0,
				portfolioSnapshots: [],
			},
		});
	}
}

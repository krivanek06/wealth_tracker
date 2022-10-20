import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma';
import { InvestmentAccount, InvestmentAccountHistory } from '../entities';

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

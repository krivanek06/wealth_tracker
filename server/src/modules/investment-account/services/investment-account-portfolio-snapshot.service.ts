import { Injectable } from '@nestjs/common';
import { PrismaService } from './../../../prisma';

@Injectable()
export class InvestmentAccountPortfolioSnapshotService {
	constructor(private prisma: PrismaService) {}

	createPortfolioSnapshot(): Promise<void> {}

	/**
	 * Recalculates InvestmentAccountHistory.portfolioSnapshots for a symbol
	 * based on InvestmentAccountHolding,id
	 *
	 * @param symbol
	 */
	recalculateInvestmentAccountPortfolioSnapshotsForSymbol(symbol: string): void {
		// load InvestmentAccountHistory
		// load InvestmentAccountHistoryChange by assetId
		/* 
            for InvestmentAccountHistoryChange.assetId === symbol
            based on InvestmentAccountHistoryChange.historyChangeInfo recalculate 
            InvestmentAccountHistory.portfolioSnapshots
            - scenario A) 
                InvestmentAccountHistoryChange.historyChangeInfo.date is sooner
                than InvestmentAccountHistory.portfolioSnapshots.snapshotDate - then add data to beginning
        */
		// check if
	}
}

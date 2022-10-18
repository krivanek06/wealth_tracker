import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma';
import { InvestmentAccountHolding } from '../entities';
import {
	InvestmentAccounHoldingCreateInput,
	InvestmentAccounHoldingDeleteInput,
	InvestmentAccounHoldingEditInput,
} from '../inputs';

@Injectable()
export class InvestmentAccountHoldingService {
	constructor(private prisma: PrismaService) {}

	createInvestmentAccountHolding(
		input: InvestmentAccounHoldingCreateInput,
		userId: string
	): Promise<InvestmentAccountHolding> {
		// TODO: check if input.symbol is really a symbol -> load data from some API
		// TODO: maximum 100 per account
		return {} as Promise<InvestmentAccountHolding>;
	}

	editInvestmentAccountHolding(
		input: InvestmentAccounHoldingEditInput,
		userId: string
	): Promise<InvestmentAccountHolding> {
		return {} as Promise<InvestmentAccountHolding>;
	}

	deleteInvestmentAccountHolding(
		input: InvestmentAccounHoldingDeleteInput,
		userId: string
	): Promise<InvestmentAccountHolding> {
		return {} as Promise<InvestmentAccountHolding>;
	}
}

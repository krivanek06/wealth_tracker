import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma';
import { INVESTMENT_ACCOUNT_HOLDING_ERROR } from '../dto';
import { InvestmentAccountHolding } from '../entities';
import {
	InvestmentAccounHoldingCreateInput,
	InvestmentAccounHoldingDeleteInput,
	InvestmentAccounHoldingEditInput,
} from '../inputs';
import { InvestmentAccountService } from './investment-account.service';

@Injectable()
export class InvestmentAccountHoldingService {
	constructor(private prisma: PrismaService, private investmentAccountService: InvestmentAccountService) {}

	async createInvestmentAccountHolding(
		input: InvestmentAccounHoldingCreateInput,
		userId: string
	): Promise<InvestmentAccountHolding> {
		// TODO: check if input.symbol is really a symbol -> load data from some API

		// load investment account to which we want to create the holding
		const investmentAccount = await this.investmentAccountService.getInvestmentAccountById(
			input.investmentAccountId,
			userId
		);

		// maximum 100 per account
		if (investmentAccount.holdings.length >= 100) {
			throw new HttpException(INVESTMENT_ACCOUNT_HOLDING_ERROR.MAXIMUM_REACHED, HttpStatus.NOT_FOUND);
		}

		// prevent adding same symbol multiple times
		const isExistsSymbol = investmentAccount.holdings.find((x) => x.id === input.symbol);
		if (!!isExistsSymbol) {
			throw new HttpException(INVESTMENT_ACCOUNT_HOLDING_ERROR.ALREADY_CONTAIN, HttpStatus.NOT_FOUND);
		}

		// create entity
		const holding: InvestmentAccountHolding = {
			id: input.symbol,
			investedAlready: input.investedAlready,
			investmentAccountId: input.investmentAccountId,
			type: input.type,
			units: input.units,
		};

		// save entity
		await this.prisma.investmentAccount.update({
			data: {
				holdings: {
					push: [holding],
				},
			},
			where: {
				id: holding.investmentAccountId,
			},
		});

		return holding;
	}

	async editInvestmentAccountHolding(
		input: InvestmentAccounHoldingEditInput,
		userId: string
	): Promise<InvestmentAccountHolding> {
		// load investment account to which we want to edit the holding
		const investmentAccount = await this.investmentAccountService.getInvestmentAccountById(
			input.investmentAccountId,
			userId
		);

		// check if symbol exists
		const isExistsSymbol = investmentAccount.holdings.find((x) => x.id === input.symbol);
		if (!isExistsSymbol) {
			throw new HttpException(INVESTMENT_ACCOUNT_HOLDING_ERROR.NOT_FOUND, HttpStatus.NOT_FOUND);
		}

		// modify isExistsSymbol with data from input
		const modifiedHolding: InvestmentAccountHolding = {
			...isExistsSymbol,
			units: input.units,
			investedAlready: input.investedAlready,
		};

		// replace the old Symbol holding with the modifiedHolding
		const newHoldings = investmentAccount.holdings.map((x) => (x.id === input.symbol ? modifiedHolding : x));

		// save data
		await this.prisma.investmentAccount.update({
			data: {
				holdings: newHoldings,
			},
			where: {
				id: input.investmentAccountId,
			},
		});

		return modifiedHolding;
	}

	async deleteInvestmentAccountHolding(
		input: InvestmentAccounHoldingDeleteInput,
		userId: string
	): Promise<InvestmentAccountHolding> {
		// load investment account to which we want to delete the holding
		const investmentAccount = await this.investmentAccountService.getInvestmentAccountById(
			input.investmentAccountId,
			userId
		);

		// check if symbol exists
		const isExistsSymbol = investmentAccount.holdings.find((x) => x.id === input.symbol);
		if (!isExistsSymbol) {
			throw new HttpException(INVESTMENT_ACCOUNT_HOLDING_ERROR.NOT_FOUND, HttpStatus.NOT_FOUND);
		}

		// filter out data that doesnt not match the symbol
		const newHoldings = investmentAccount.holdings.filter((x) => x.id !== input.symbol);

		// save data
		await this.prisma.investmentAccount.update({
			data: {
				holdings: newHoldings,
			},
			where: {
				id: input.investmentAccountId,
			},
		});

		return isExistsSymbol;
	}
}

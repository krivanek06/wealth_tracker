import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma';
import { INVESTMENT_ACCOUNT_HOLDING_ERROR, INVESTMENT_ACOUNT_HOLDING_LIMIT } from '../dto';
import { InvestmentAccount, InvestmentAccountHolding } from '../entities';
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
		if (investmentAccount.holdings.length >= INVESTMENT_ACOUNT_HOLDING_LIMIT) {
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
		const newHoldings = [...investmentAccount.holdings, holding];
		await this.updateInvestmentAccountHolding(holding.investmentAccountId, newHoldings);

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
		await this.updateInvestmentAccountHolding(input.investmentAccountId, newHoldings);

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
		await this.updateInvestmentAccountHolding(input.investmentAccountId, newHoldings);

		return isExistsSymbol;
	}

	private updateInvestmentAccountHolding(
		investmentAccountId: string,
		newHoldings: InvestmentAccountHolding[]
	): Promise<InvestmentAccount> {
		return this.prisma.investmentAccount.update({
			data: {
				holdings: newHoldings,
			},
			where: {
				id: investmentAccountId,
			},
		});
	}
}

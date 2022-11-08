import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma';
import { INVESTMENT_ACCOUNT_CASH_CHANGE_ERROR, INVESTMENT_ACCOUNT_ERROR } from '../dto';
import { InvestmentAccount, InvestmentAccountCashChange } from '../entities';
import {
	InvestmentAccountCashCreateInput,
	InvestmentAccountCashDeleteInput,
	InvestmentAccountCashEditInput,
} from '../inputs';
import { SharedServiceUtil } from './../../../utils';

@Injectable()
export class InvestmentAccountCacheChangeService {
	constructor(private prisma: PrismaService) {}

	async createInvestmentAccountCashe(
		input: InvestmentAccountCashCreateInput,
		userId: string
	): Promise<InvestmentAccountCashChange> {
		const account = await this.getInvestmentAccount(input.investmentAccountId, userId);

		const entry: InvestmentAccountCashChange = {
			itemId: SharedServiceUtil.getUUID(),
			cashCurrent: input.cashCurrent,
			date: new Date(input.date),
		};

		// modify in DB
		await this.updateInvestmentAccountCashchange(input.investmentAccountId, [...account.cashChange, entry]);

		return entry;
	}

	async editInvestmentAccountCashe(
		input: InvestmentAccountCashEditInput,
		userId: string
	): Promise<InvestmentAccountCashChange> {
		const account = await this.getInvestmentAccount(input.investmentAccountId, userId);

		// edit the correct itemId
		const editedCashChanges = account.cashChange.map((d) => {
			if (d.itemId === input.itemId) {
				return { ...d, date: new Date(input.date), cashCurrent: input.cashCurrent };
			}
			return d;
		});

		// return back to user
		const editedChange = editedCashChanges.find((d) => d.itemId === input.itemId);

		if (!editedChange) {
			throw new HttpException(INVESTMENT_ACCOUNT_CASH_CHANGE_ERROR.NOT_FOUND, HttpStatus.INTERNAL_SERVER_ERROR);
		}

		// modify in DB
		await this.updateInvestmentAccountCashchange(input.investmentAccountId, editedCashChanges);

		return editedChange;
	}

	async deleteInvestmentAccountCashe(
		input: InvestmentAccountCashDeleteInput,
		userId: string
	): Promise<InvestmentAccountCashChange> {
		const account = await this.getInvestmentAccount(input.investmentAccountId, userId);

		// return back to user
		const editedChange = account.cashChange.find((d) => d.itemId === input.itemId);
		const filteredOut = account.cashChange.filter((d) => d.itemId !== input.itemId);

		if (!editedChange) {
			throw new HttpException(INVESTMENT_ACCOUNT_CASH_CHANGE_ERROR.NOT_FOUND, HttpStatus.INTERNAL_SERVER_ERROR);
		}

		// modify in DB
		await this.updateInvestmentAccountCashchange(input.investmentAccountId, filteredOut);

		return editedChange;
	}

	private async updateInvestmentAccountCashchange(
		investmentAccountId: string,
		cashChange: InvestmentAccountCashChange[]
	): Promise<void> {
		await this.prisma.investmentAccount.update({
			data: {
				cashChange: {
					set: [...cashChange],
				},
			},
			where: {
				id: investmentAccountId,
			},
		});
		return;
	}

	private async getInvestmentAccount(investmentAccountId: string, userId: string): Promise<InvestmentAccount> {
		const account = await this.prisma.investmentAccount.findFirst({
			where: {
				id: investmentAccountId,
				userId,
			},
		});

		// no account found to be deleted
		if (!account) {
			throw new HttpException(INVESTMENT_ACCOUNT_ERROR.NOT_FOUND, HttpStatus.INTERNAL_SERVER_ERROR);
		}

		return account;
	}
}

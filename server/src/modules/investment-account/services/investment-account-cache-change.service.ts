import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma';
import { INVESTMENT_ACCOUNT_CASH_CHANGE_ERROR, INVESTMENT_ACCOUNT_ERROR } from '../dto';
import { InvestmentAccount, InvestmentAccountCashChange } from '../entities';
import {
	InvestmentAccountCashCreateInput,
	InvestmentAccountCashDeleteInput,
	InvestmentAccountCashEditInput,
} from '../inputs';
import { MomentServiceUtil, SharedServiceUtil } from './../../../utils';

@Injectable()
export class InvestmentAccountCashChangeService {
	constructor(private prisma: PrismaService) {}

	async createInvestmentAccountCashe(
		input: InvestmentAccountCashCreateInput,
		userId: string
	): Promise<InvestmentAccountCashChange> {
		const account = await this.getInvestmentAccount(input.investmentAccountId, userId);

		const entry: InvestmentAccountCashChange = {
			itemId: SharedServiceUtil.getUUID(),
			cashCurrent: input.cashCurrent,
			date: MomentServiceUtil.format(input.date),
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
				return {
					...d,
					date: MomentServiceUtil.format(input.date),
					cashCurrent: input.cashCurrent,
				} as InvestmentAccountCashChange;
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
		const removedCashChange = account.cashChange.find((d) => d.itemId === input.itemId);
		const filteredOut = account.cashChange.filter((d) => d.itemId !== input.itemId);

		if (!removedCashChange) {
			throw new HttpException(INVESTMENT_ACCOUNT_CASH_CHANGE_ERROR.NOT_FOUND, HttpStatus.INTERNAL_SERVER_ERROR);
		}

		// modify in DB
		await this.updateInvestmentAccountCashchange(input.investmentAccountId, filteredOut);

		return removedCashChange;
	}

	private async updateInvestmentAccountCashchange(
		investmentAccountId: string,
		cashChangeInput: InvestmentAccountCashChange[]
	): Promise<void> {
		// order ASC
		const cashChange = cashChangeInput.sort((a, b) => (a.date < b.date ? -1 : 1));

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

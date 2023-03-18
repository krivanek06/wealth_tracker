import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InvestmentAccountCashChangeType } from '@prisma/client';
import { MomentServiceUtil, SharedServiceUtil } from '../../../utils';
import { INVESTMENT_ACCOUNT_CASH_CHANGE_ERROR, INVESTMENT_ACCOUNT_CASH_CHANGE_TYPE_IMAGES } from '../dto';
import { InvestmentAccount, InvestmentAccountCashChange } from '../entities';
import {
	InvestmentAccountCashCreateInput,
	InvestmentAccountCashDeleteInput,
	InvestmentAccountCashEditInput,
} from '../inputs';
import { InvestmentAccountRepositoryService } from './investment-account-repository.service';

@Injectable()
export class InvestmentAccountCashChangeService {
	constructor(private investmentAccountRepositoryService: InvestmentAccountRepositoryService) {}

	async createInvestmentAccountCash(
		input: InvestmentAccountCashCreateInput,
		userId: string
	): Promise<InvestmentAccountCashChange> {
		const account = await this.investmentAccountRepositoryService.getInvestmentAccountByUserId(userId);

		const entry: InvestmentAccountCashChange = {
			itemId: SharedServiceUtil.getUUID(),
			date: MomentServiceUtil.format(input.date),
			cashValue: SharedServiceUtil.roundDec(input.cashValue),
			type: input.type,
		};

		// modify in DB
		await this.updateInvestmentAccountCashChange(input.investmentAccountId, [...account.cashChange, entry]);

		return entry;
	}

	async editInvestmentAccountCash(
		input: InvestmentAccountCashEditInput,
		userId: string
	): Promise<InvestmentAccountCashChange> {
		const account = await this.investmentAccountRepositoryService.getInvestmentAccountByUserId(userId);

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
		await this.updateInvestmentAccountCashChange(input.investmentAccountId, editedCashChanges);

		return editedChange;
	}

	async deleteInvestmentAccountCash(
		input: InvestmentAccountCashDeleteInput,
		userId: string
	): Promise<InvestmentAccountCashChange> {
		const account = await this.investmentAccountRepositoryService.getInvestmentAccountByUserId(userId);

		// return back to user
		const removedCashChange = account.cashChange.find((d) => d.itemId === input.itemId);
		const filteredOut = account.cashChange.filter((d) => d.itemId !== input.itemId);

		// modify in DB
		await this.updateInvestmentAccountCashChange(input.investmentAccountId, filteredOut);

		return removedCashChange;
	}

	getCashTypeImageUrl(cashChange: InvestmentAccountCashChange): string {
		if (cashChange.type === InvestmentAccountCashChangeType.DEPOSIT) {
			return INVESTMENT_ACCOUNT_CASH_CHANGE_TYPE_IMAGES.DEPOSIT;
		}

		if (cashChange.type === InvestmentAccountCashChangeType.WITHDRAWAL) {
			return INVESTMENT_ACCOUNT_CASH_CHANGE_TYPE_IMAGES.WITHDRAWAL;
		}

		return INVESTMENT_ACCOUNT_CASH_CHANGE_TYPE_IMAGES.ASSET_OPERATION;
	}

	private async updateInvestmentAccountCashChange(
		investmentAccountId: string,
		cashChangeInput: InvestmentAccountCashChange[]
	): Promise<InvestmentAccount> {
		// order ASC
		const cashChange = cashChangeInput.sort((a, b) => (a.date < b.date ? -1 : 1));
		return this.investmentAccountRepositoryService.updateInvestmentAccount(investmentAccountId, {
			cashChange: cashChange,
		});
	}
}

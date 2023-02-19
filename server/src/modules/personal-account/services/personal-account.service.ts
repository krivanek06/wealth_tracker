import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { PERSONAL_ACCOUNT_ERROR } from '../dto';
import { PersonalAccount } from '../entities';
import { PersonalAccountCreateInput, PersonalAccountEditInput } from '../inputs';
import { PersonalAccountRepositoryService } from '../repository';

@Injectable()
export class PersonalAccountService {
	constructor(private readonly personalAccountRepositoryService: PersonalAccountRepositoryService) {}

	/* Queries */
	getPersonalAccountById(personalAccountId: string): Promise<PersonalAccount> {
		return this.personalAccountRepositoryService.getPersonalAccountById(personalAccountId);
	}

	getPersonalAccounts(userId: string): Promise<PersonalAccount[]> {
		return this.personalAccountRepositoryService.getPersonalAccounts(userId);
	}

	/* Mutations */
	async createPersonalAccount({ name }: PersonalAccountCreateInput, userId: string): Promise<PersonalAccount> {
		const personalAccountCount = await this.personalAccountRepositoryService.getPersonalAccountCount(userId);

		// prevent creating more than 5 personal accounts per user
		if (personalAccountCount > 4) {
			throw new HttpException(PERSONAL_ACCOUNT_ERROR.NOT_ALLOWED_TO_CREATE, HttpStatus.FORBIDDEN);
		}

		// create personal account
		const personalAccount = await this.personalAccountRepositoryService.createPersonalAccount(
			name,
			userId,
			AccountType.PERSONAL
		);

		// TODO: remove this - on dailyData create will be fire to create monthly data
		// created date details
		// const { year, month } = MomentServiceUtil.getDetailsInformationFromDate(personalAccount.createdAt);

		// // create monthly data for the new personal account
		// await this.personalAccountMonthlyService.createMonthlyData(personalAccount, userId, year, month);

		return personalAccount;
	}

	async editPersonalAccount({ id, name }: PersonalAccountEditInput, userId: string): Promise<PersonalAccount> {
		const isPersonalAccountExists = await this.personalAccountRepositoryService.isPersonalAccountExist(id, userId);

		// no account found to be deleted
		if (!isPersonalAccountExists) {
			throw new HttpException(PERSONAL_ACCOUNT_ERROR.NOT_FOUND, HttpStatus.INTERNAL_SERVER_ERROR);
		}

		return this.personalAccountRepositoryService.updatePersonalAccount(id, { name });
	}

	async deletePersonalAccount(personalAccountId: string, userId: string): Promise<PersonalAccount> {
		const isPersonalAccountExists = await this.personalAccountRepositoryService.isPersonalAccountExist(
			personalAccountId,
			userId
		);

		// no account found to be deleted
		if (!isPersonalAccountExists) {
			throw new HttpException(PERSONAL_ACCOUNT_ERROR.NOT_FOUND, HttpStatus.INTERNAL_SERVER_ERROR);
		}

		return this.personalAccountRepositoryService.deletePersonalAccount(personalAccountId);
	}
}

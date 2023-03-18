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
	getPersonalAccountByUserId(userId: string): Promise<PersonalAccount | undefined> {
		return this.personalAccountRepositoryService.getPersonalAccountByUserId(userId);
	}

	/* Mutations */
	async createPersonalAccount({ name }: PersonalAccountCreateInput, userId: string): Promise<PersonalAccount> {
		const existingPersonalAccount = await this.personalAccountRepositoryService.getPersonalAccountByUserId(userId);

		// prevent creating more than 5 personal accounts per user
		if (existingPersonalAccount) {
			throw new HttpException(PERSONAL_ACCOUNT_ERROR.NOT_ALLOWED_TO_CREATE, HttpStatus.FORBIDDEN);
		}

		// create personal account
		const personalAccount = await this.personalAccountRepositoryService.createPersonalAccount(
			name,
			userId,
			AccountType.PERSONAL
		);

		return personalAccount;
	}

	async editPersonalAccount({ id, name }: PersonalAccountEditInput, userId: string): Promise<PersonalAccount> {
		const existingPersonalAccount = await this.personalAccountRepositoryService.getPersonalAccountByUserId(userId);

		// no account found to be deleted
		if (!existingPersonalAccount) {
			throw new HttpException(PERSONAL_ACCOUNT_ERROR.NOT_FOUND, HttpStatus.INTERNAL_SERVER_ERROR);
		}

		return this.personalAccountRepositoryService.updatePersonalAccount(id, { name });
	}

	async deletePersonalAccount(personalAccountId: string, userId: string): Promise<PersonalAccount> {
		const existingPersonalAccount = await this.personalAccountRepositoryService.getPersonalAccountByUserId(userId);

		// no account found to be deleted
		if (!existingPersonalAccount) {
			throw new HttpException(PERSONAL_ACCOUNT_ERROR.NOT_FOUND, HttpStatus.INTERNAL_SERVER_ERROR);
		}

		return this.personalAccountRepositoryService.deletePersonalAccount(personalAccountId);
	}
}

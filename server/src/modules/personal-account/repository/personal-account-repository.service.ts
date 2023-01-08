import { Injectable } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { PrismaService } from '../../../prisma';
import { SharedServiceUtil } from '../../../utils';
import { PERSONAL_ACCOUNT_DEFAULT_TAGS } from '../dto';
import { PersonalAccount, PersonalAccountTag } from '../entities';

@Injectable()
export class PersonalAccountRepositoryService {
	constructor(private prisma: PrismaService) {}

	getPersonalAccountById(personalAccountId: string): Promise<PersonalAccount> {
		return this.prisma.personalAccount.findFirst({
			where: {
				id: personalAccountId,
			},
		});
	}

	getPersonalAccounts(userId: string): Promise<PersonalAccount[]> {
		return this.prisma.personalAccount.findMany({
			where: {
				userId,
			},
		});
	}

	getPersonalAccountCount(userId: string): Promise<number> {
		return this.prisma.personalAccount.count({
			where: {
				userId,
			},
		});
	}

	createPersonalAccount(name: string, userId: string, accountType: AccountType): Promise<PersonalAccount> {
		// create some default tags into the account
		const defaultTags = PERSONAL_ACCOUNT_DEFAULT_TAGS.map((tag) => {
			const data: PersonalAccountTag = {
				id: SharedServiceUtil.getUUID(),
				imageUrl: tag.url,
				userId: userId,
				createdAt: new Date(),
				name: tag.name,
				type: tag.type,
				color: tag.color,
			};

			return data;
		});

		return this.prisma.personalAccount.create({
			data: {
				name,
				userId,
				personalAccountTag: defaultTags,
				accountType,
			},
		});
	}

	updatePersonalAccount(accountId: string, data: Partial<PersonalAccount>): Promise<PersonalAccount> {
		return this.prisma.personalAccount.update({
			data: {
				...data,
			},
			where: {
				id: accountId,
			},
		});
	}

	deletePersonalAccount(accountId: string): Promise<PersonalAccount> {
		return this.prisma.personalAccount.delete({
			where: {
				id: accountId,
			},
		});
	}

	/**
	 *
	 * @param personalAccountId {string} id of the personal account we want to load
	 * @returns whether a personal account exists by the personalAccountId
	 */
	async isPersonalAccountExist(personalAccountId: string, userId: string): Promise<boolean> {
		const accountCount = await this.prisma.personalAccount.count({
			where: {
				id: personalAccountId,
				userId,
			},
		});

		return accountCount > 0;
	}
}

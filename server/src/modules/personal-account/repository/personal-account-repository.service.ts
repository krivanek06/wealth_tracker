import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { PrismaService } from '../../../prisma';
import { SharedServiceUtil } from '../../../utils';
import { PERSONAL_ACCOUNT_DEFAULT_TAGS, PERSONAL_ACCOUNT_ERROR } from '../dto';
import { PersonalAccount, PersonalAccountTag } from '../entities';

@Injectable()
export class PersonalAccountRepositoryService {
	constructor(private prisma: PrismaService) {}

	async getPersonalAccountByIdStrict(personalAccountId: string): Promise<PersonalAccount> {
		const personalAccount = this.prisma.personalAccount.findFirst({
			where: {
				id: personalAccountId,
			},
		});

		// not found investment account
		if (!personalAccount) {
			throw new HttpException(PERSONAL_ACCOUNT_ERROR.NOT_FOUND, HttpStatus.NOT_FOUND);
		}

		return personalAccount;
	}

	async getPersonalAccountByUserIdStrict(userId: string): Promise<PersonalAccount> {
		const personalAccount = this.prisma.personalAccount.findUnique({
			where: {
				userId,
			},
		});

		// not found investment account
		if (!personalAccount) {
			throw new HttpException(PERSONAL_ACCOUNT_ERROR.NOT_FOUND, HttpStatus.NOT_FOUND);
		}

		return personalAccount;
	}

	getPersonalAccountByUserId(userId: string): Promise<PersonalAccount | undefined> {
		return this.prisma.personalAccount.findUnique({
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
				budgetMonthly: null,
			};

			return data;
		});

		return this.prisma.personalAccount.create({
			data: {
				name,
				userId,
				personalAccountTag: defaultTags,
				accountType,
				enabledBudgeting: true,
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
}

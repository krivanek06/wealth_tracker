import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma';
import { PERSONAL_ACCOUNT_ERROR } from '../dto';
import { PersonalAccount } from '../entities';
import { PersonalAccountCreateInput, PersonalAccountEditInput } from '../inputs';
import { MomentServiceUtil } from './../../../utils';
import { PersonalAccountMonthlyService } from './personal-account-monthly.service';
import { PersonalAccountTagService } from './personal-account-tag.service';

@Injectable()
export class PersonalAccountService {
	constructor(
		private prisma: PrismaService,
		private personalAccountMonthlyService: PersonalAccountMonthlyService,
		private personalAccountTagService: PersonalAccountTagService
	) {}

	/* Queries */
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

	/* Mutations */
	async createPersonalAccount({ name }: PersonalAccountCreateInput, userId: string): Promise<PersonalAccount> {
		const personalAccountCount = await this.prisma.personalAccount.count({
			where: {
				userId,
			},
		});

		// prevent creating more than 5 personal accounts per user
		if (personalAccountCount > 4) {
			throw new HttpException(PERSONAL_ACCOUNT_ERROR.NOT_ALLOWED_TO_CREATE, HttpStatus.FORBIDDEN);
		}

		// create personal account
		const personalAccount = await this.prisma.personalAccount.create({
			data: {
				name,
				userId,
				personalAccountTag: [],
			},
		});

		// add default tags
		await this.personalAccountTagService.registerDefaultTagsForPersonalAccountId(personalAccount.id, userId);

		// created date details
		const { year, month } = MomentServiceUtil.getDetailsInformationFromDate(personalAccount.createdAt);

		// create monthly data for the new personal account
		await this.personalAccountMonthlyService.createMonthlyData(personalAccount, userId, year, month);

		return personalAccount;
	}

	async editPersonalAccount({ id, name }: PersonalAccountEditInput, userId: string): Promise<PersonalAccount> {
		const isPersonalAccountExists = await this.isPersonalAccountExist(id, userId);

		// no account found to be deleted
		if (!isPersonalAccountExists) {
			throw new HttpException(PERSONAL_ACCOUNT_ERROR.NOT_FOUND, HttpStatus.INTERNAL_SERVER_ERROR);
		}

		return this.prisma.personalAccount.update({
			data: {
				name,
			},
			where: {
				id,
			},
		});
	}

	async deletePersonalAccount(personalAccountId: string, userId: string): Promise<PersonalAccount> {
		const isPersonalAccountExists = await this.isPersonalAccountExist(personalAccountId, userId);

		// no account found to be deleted
		if (!isPersonalAccountExists) {
			throw new HttpException(PERSONAL_ACCOUNT_ERROR.NOT_FOUND, HttpStatus.INTERNAL_SERVER_ERROR);
		}

		return this.prisma.personalAccount.delete({
			where: {
				id: personalAccountId,
			},
		});
	}

	/**
	 *
	 * @param personalAccountId {string} id of the personal account we want to load
	 * @returns whether a personal account exists by the personalAccountId
	 */
	private async isPersonalAccountExist(personalAccountId: string, userId: string): Promise<boolean> {
		const accountCount = await this.prisma.personalAccount.count({
			where: {
				id: personalAccountId,
				userId,
			},
		});

		return accountCount > 0;
	}
}

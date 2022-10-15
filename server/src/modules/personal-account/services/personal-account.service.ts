import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma';
import { PersonalAccount } from '../entities';
import { PersonalAccountCreateInput, PersonalAccountEditInput } from '../inputs';
import { MomentServiceUtil } from './../../../utils';
import { PersonalAccountMonthlyService } from './personal-account-monthly.service';

@Injectable()
export class PersonalAccountService {
	constructor(private prisma: PrismaService, private personalAccountMonthlyService: PersonalAccountMonthlyService) {}

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
		// create personal account
		const personalAccount = await this.prisma.personalAccount.create({
			data: {
				name,
				userId,
			},
		});

		// created date details
		const { year, month } = MomentServiceUtil.getDetailsInformationFromDate(personalAccount.createdAt);

		// create monthly data for the new personal account
		await this.personalAccountMonthlyService.createMonthlyData(personalAccount.id, year, month);

		return personalAccount;
	}

	async editPersonalAccount({ id, name }: PersonalAccountEditInput, userId: string): Promise<PersonalAccount> {
		const isPersonalAccountExists = await this.isPersonalAccountExists(id);

		// no account found to be deleted
		if (!isPersonalAccountExists) {
			throw new HttpException(`Personal account not found, can not be removed`, HttpStatus.INTERNAL_SERVER_ERROR);
		}

		// TODO: should also check if perosnal account belongs to the userId
		return this.prisma.personalAccount.update({
			data: {
				name,
			},
			where: {
				id,
			},
		});
	}

	async deletePersonalAccount(personalAccountId: string): Promise<PersonalAccount> {
		const isPersonalAccountExists = await this.isPersonalAccountExists(personalAccountId);

		// no account found to be deleted
		if (!isPersonalAccountExists) {
			throw new HttpException(`Personal account not found, can not be removed`, HttpStatus.INTERNAL_SERVER_ERROR);
		}

		return this.prisma.personalAccount.delete({
			where: {
				id: personalAccountId,
			},
		});
	}

	private async isPersonalAccountExists(personalAccountId: string): Promise<boolean> {
		const accountCount = await this.prisma.personalAccount.count({
			where: {
				id: personalAccountId,
			},
		});

		return accountCount > 0;
	}
}

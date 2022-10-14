import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { MomentServiceUtil } from './../../../utils';
import { PersonalAccountCreateInput, PersonalAccountEditInput } from './dto';
import { PersonalAccount } from './entity';
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

	editPersonalAccount({ id, name }: PersonalAccountEditInput, userId: string): Promise<PersonalAccount> {
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

	deletePersonalAccount(personalAccountId: string): Promise<PersonalAccount> {
		return this.prisma.personalAccount.delete({
			where: {
				id: personalAccountId,
			},
		});
	}
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { PersonalAccountCreateInput, PersonalAccountEditInput } from './dto';
import { PersonalAccount } from './entity';

@Injectable()
export class PersonalAccountService {
	constructor(private prisma: PrismaService) {}

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
	createPersonalAccount({ name }: PersonalAccountCreateInput, userId: string): Promise<PersonalAccount> {
		return this.prisma.personalAccount.create({
			data: {
				name,
				userId,
			},
		});
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
}

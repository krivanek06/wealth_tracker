import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { PersonalAccountCreateInput } from './dto';
import { PersonalAccount } from './entity';

@Injectable()
export class PersonalAccountService {
	constructor(private prisma: PrismaService) {}

	createPersonalAccount({ name }: PersonalAccountCreateInput, userId: string): Promise<PersonalAccount> {
		return this.prisma.personalAccount.create({
			data: {
				name,
				userId,
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
}

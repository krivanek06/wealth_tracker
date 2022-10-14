import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { PersonalAccount } from './entity';

@Injectable()
export class PersonalAccountService {
	constructor(private prisma: PrismaService) {}

	getPersonalAccounts(userId: string): Promise<PersonalAccount[]> {
		return this.prisma.personalAccount.findMany({
			where: {
				userId,
			},
		});
	}
}

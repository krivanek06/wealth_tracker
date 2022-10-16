import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma';
import { PersonalAccount, PersonalAccountMonthlyData } from '../entities';

@Injectable()
export class PersonalAccountMonthlyService {
	constructor(private prisma: PrismaService) {}

	async getMonthlyDataByAccountId({ id }: PersonalAccount): Promise<PersonalAccountMonthlyData[]> {
		return this.prisma.personalAccountMonthlyData.findMany({
			where: {
				personalAccountId: id,
			},
		});
	}

	async getMonthlyDataDailyEntries({ id }: PersonalAccountMonthlyData): Promise<number> {
		// TODO can it be done better, only selecting the length of the array?
		const personalAccount = await this.prisma.personalAccountMonthlyData.findFirst({
			where: {
				id,
			},
		});
		return personalAccount.dailyData.length ?? 0;
	}

	async createMonthlyData({ id }: PersonalAccount, year, month): Promise<PersonalAccountMonthlyData> {
		return this.prisma.personalAccountMonthlyData.create({
			data: {
				personalAccountId: id,
				year,
				month,
				dailyData: [],
			},
		});
	}
}

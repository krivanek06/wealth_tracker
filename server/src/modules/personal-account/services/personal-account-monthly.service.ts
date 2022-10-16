import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma';
import { PersonalAccountMonthlyData } from '../entities';

@Injectable()
export class PersonalAccountMonthlyService {
	constructor(private prisma: PrismaService) {}

	async getMonthlyDataByAccountId(personalAccountId: string): Promise<PersonalAccountMonthlyData[]> {
		return this.prisma.personalAccountMonthlyData.findMany({
			where: {
				personalAccountId,
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

	async createMonthlyData(personalAccountId: string, year, month): Promise<PersonalAccountMonthlyData> {
		return this.prisma.personalAccountMonthlyData.create({
			data: {
				personalAccountId,
				year,
				month,
				dailyData: [],
			},
		});
	}
}

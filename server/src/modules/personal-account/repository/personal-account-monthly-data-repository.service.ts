import { PrismaService } from '../../../prisma';
import { PersonalAccountMonthlyData } from '../entities';

export class PersonalAccountMonthlyDataRepository {
	constructor(private prisma: PrismaService) {}

	async getMonthlyDataByAccountId(id: string): Promise<PersonalAccountMonthlyData[]> {
		const monthlyData = await this.prisma.personalAccountMonthlyData.findMany({
			where: {
				personalAccountId: id,
			},
		});

		// sort ASC
		const mergedMonthlyData = monthlyData.sort((a, b) =>
			b.year > a.year ? -1 : b.year === a.year && b.month > a.month ? -1 : 1
		);

		return mergedMonthlyData;
	}

	getMonthlyDataById(monthlyDataId: string, userId: string): Promise<PersonalAccountMonthlyData> {
		return this.prisma.personalAccountMonthlyData.findFirst({
			where: {
				id: monthlyDataId,
				userId,
			},
		});
	}

	getMonthlyDataByYearAndMont(
		personalAccountId: string,
		year: number,
		month: number
	): Promise<PersonalAccountMonthlyData> {
		return this.prisma.personalAccountMonthlyData.findFirst({
			where: {
				personalAccountId,
				year,
				month,
			},
		});
	}

	createMonthlyData(
		personalAccountId: string,
		userId: string,
		year: number,
		month: number
	): Promise<PersonalAccountMonthlyData> {
		return this.prisma.personalAccountMonthlyData.create({
			data: {
				personalAccountId,
				userId,
				year,
				month,
				dailyData: [],
			},
		});
	}

	updateMonthlyData(accountId: string, data: Partial<PersonalAccountMonthlyData>): Promise<PersonalAccountMonthlyData> {
		return this.prisma.personalAccountMonthlyData.update({
			data: {
				...data,
			},
			where: {
				id: accountId,
			},
		});
	}
}

import { PrismaService } from '../../../prisma';
import { PersonalAccount, PersonalAccountMonthlyData } from '../entities';

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

	createMonthlyData(
		{ id }: PersonalAccount,
		userId: string,
		year: number,
		month: number
	): Promise<PersonalAccountMonthlyData> {
		return this.prisma.personalAccountMonthlyData.create({
			data: {
				personalAccountId: id,
				userId,
				year,
				month,
				dailyData: [],
			},
		});
	}
}

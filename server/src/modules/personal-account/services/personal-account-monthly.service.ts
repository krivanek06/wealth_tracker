import { Injectable } from '@nestjs/common';
import { PersonalAccountTagDataType } from '@prisma/client';
import { PrismaService } from '../../../prisma';
import { PersonalAccount, PersonalAccountMonthlyData } from '../entities';
import { PersonalAccountTagService } from './personal-account-tag.service';

@Injectable()
export class PersonalAccountMonthlyService {
	constructor(private prisma: PrismaService, private personalAccountTagService: PersonalAccountTagService) {}

	getMonthlyDataByAccountId({ id }: PersonalAccount): Promise<PersonalAccountMonthlyData[]> {
		return this.prisma.personalAccountMonthlyData.findMany({
			where: {
				personalAccountId: id,
			},
		});
	}

	getMonthlyDataById(monthlyDataId: string, userId: string): Promise<PersonalAccountMonthlyData> {
		return this.prisma.personalAccountMonthlyData.findFirst({
			where: {
				id: monthlyDataId,
				userId,
			},
		});
	}

	createMonthlyData({ id }: PersonalAccount, userId: string, year, month): Promise<PersonalAccountMonthlyData> {
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

	/**
	 *
	 * @param personalAccountMonthlyData
	 * @returns the sum of PersonalAccountMonthlyData.dailyData that has an income tag associated with it
	 */
	getMonthlyIncomeOrExpense(
		personalAccountMonthlyData: PersonalAccountMonthlyData,
		tagType: PersonalAccountTagDataType
	): number {
		const defaultTagTypes = this.personalAccountTagService.getDefaultTagsByTypes(tagType);
		const defaultTagTypesIds = defaultTagTypes.map((x) => x.id);

		// filter out daily data
		const dailyIncomeData = personalAccountMonthlyData.dailyData.filter((d) => defaultTagTypesIds.includes(d.tagId));

		// calculate total sum
		const dailyIncomSum = dailyIncomeData.reduce((a, b) => a + b.value, 0);

		return dailyIncomSum;
	}
}

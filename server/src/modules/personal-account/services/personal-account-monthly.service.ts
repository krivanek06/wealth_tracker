import { Injectable } from '@nestjs/common';
import { PersonalAccountTagDataType } from '@prisma/client';
import { PersonalAccount, PersonalAccountMonthlyData } from '../entities';
import { PersonalAccountDailyDataOutput } from '../outputs';
import { PersonalAccountMonthlyDataRepository, PersonalAccountRepositoryService } from '../repository';

@Injectable()
export class PersonalAccountMonthlyService {
	constructor(
		private readonly personalAccountMonthlyDataRepository: PersonalAccountMonthlyDataRepository,
		private readonly personalAccountRepositoryService: PersonalAccountRepositoryService
	) {}

	getMonthlyDataByAccountId(id: string): Promise<PersonalAccountMonthlyData[]> {
		return this.personalAccountMonthlyDataRepository.getMonthlyDataByAccountId(id);
	}

	getMonthlyDataById(monthlyDataId: string, userId: string): Promise<PersonalAccountMonthlyData> {
		return this.personalAccountMonthlyDataRepository.getMonthlyDataById(monthlyDataId, userId);
	}

	createMonthlyData(
		personalAccount: PersonalAccount,
		userId: string,
		year: number,
		month: number
	): Promise<PersonalAccountMonthlyData> {
		return this.personalAccountMonthlyDataRepository.createMonthlyData(personalAccount, userId, year, month);
	}

	/**
	 *
	 * @param personalAccountMonthlyData
	 * @returns the sum of PersonalAccountMonthlyData.dailyData that has an income tag associated with it
	 */
	async getMonthlyIncomeOrExpense(
		personalAccountMonthlyData: PersonalAccountMonthlyData,
		tagType: PersonalAccountTagDataType
	): Promise<PersonalAccountDailyDataOutput[]> {
		const personalAccount = await this.personalAccountRepositoryService.getPersonalAccountById(
			personalAccountMonthlyData.personalAccountId
		);

		const personalAccountTags = personalAccount.personalAccountTag.filter((d) => d.type === tagType);
		const personalAccountTagIds = personalAccountTags.map((x) => x.id);

		// filter out daily data
		const dailyData = personalAccountMonthlyData.dailyData
			.filter((d) => personalAccountTagIds.includes(d.tagId))
			.map((d) => {
				const personalAccountTag = personalAccountTags.find((tag) => tag.id === d.tagId);
				return { ...d, personalAccountTag } as PersonalAccountDailyDataOutput;
			});

		return dailyData;
	}
}

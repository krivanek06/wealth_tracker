import { Injectable } from '@nestjs/common';
import { PersonalAccountTagDataType } from '@prisma/client';
import { PersonalAccountMonthlyData } from '../entities';
import { PersonalAccountDailyDataOutput } from '../outputs';
import { PersonalAccountMonthlyDataRepositoryService, PersonalAccountRepositoryService } from '../repository';

@Injectable()
export class PersonalAccountMonthlyService {
	constructor(
		private readonly personalAccountMonthlyDataRepository: PersonalAccountMonthlyDataRepositoryService,
		private readonly personalAccountRepositoryService: PersonalAccountRepositoryService
	) {}

	getMonthlyDataByAccountId(id: string): Promise<PersonalAccountMonthlyData[]> {
		return this.personalAccountMonthlyDataRepository.getMonthlyDataByAccountId(id);
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
		const personalAccount = await this.personalAccountRepositoryService.getPersonalAccountByIdStrict(
			personalAccountMonthlyData.personalAccountId
		);

		const personalAccountTags = personalAccount.personalAccountTag.filter((d) => d.type === tagType);
		const personalAccountTagIds = personalAccountTags.map((x) => x.id);

		// filter out daily data
		const dailyData = personalAccountMonthlyData.dailyData
			.filter((d) => personalAccountTagIds.includes(d.tagId))
			.map((d) => {
				const personalAccountTag = personalAccountTags.find((tag) => tag.id === d.tagId);
				return { ...d, tag: personalAccountTag } as PersonalAccountDailyDataOutput;
			});

		return dailyData;
	}
}

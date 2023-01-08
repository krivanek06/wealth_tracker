import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PersonalAccountTagDataType } from '@prisma/client';
import { PersonalAccount, PersonalAccountMonthlyData } from '../entities';
import { PersonalAccountDailyDataOutput } from '../outputs';
import { PersonalAccountMonthlyDataRepositoryService, PersonalAccountRepositoryService } from '../repository';
import { PERSONAL_ACCOUNT_ERROR_MONTHLY_DATA } from './../dto';

@Injectable()
export class PersonalAccountMonthlyService {
	constructor(
		private readonly personalAccountMonthlyDataRepository: PersonalAccountMonthlyDataRepositoryService,
		private readonly personalAccountRepositoryService: PersonalAccountRepositoryService
	) {}

	getMonthlyDataByAccountId(id: string): Promise<PersonalAccountMonthlyData[]> {
		return this.personalAccountMonthlyDataRepository.getMonthlyDataByAccountId(id);
	}

	async getMonthlyDataById(monthlyDataId: string, userId: string): Promise<PersonalAccountMonthlyData> {
		try {
			const data = await this.personalAccountMonthlyDataRepository.getMonthlyDataById(monthlyDataId, userId);
			return data;
		} catch (e) {
			console.log(e);
			throw new HttpException(PERSONAL_ACCOUNT_ERROR_MONTHLY_DATA.NOT_FOUND, HttpStatus.NOT_FOUND);
		}
	}

	createMonthlyData(
		personalAccount: PersonalAccount,
		userId: string,
		year: number,
		month: number
	): Promise<PersonalAccountMonthlyData> {
		return this.personalAccountMonthlyDataRepository.createMonthlyData(personalAccount.id, userId, year, month);
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

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MomentServiceUtil, SharedServiceUtil } from '../../../utils';
import { PERSONAL_ACCOUNT_ERROR_DAILY_DATA, PERSONAL_ACCOUNT_ERROR_MONTHLY_DATA } from '../dto';
import { PersonalAccountDailyData } from '../entities';
import {
	PersonalAccountDailyDataCreate,
	PersonalAccountDailyDataDelete,
	PersonalAccountDailyDataEdit,
	PersonalAccountDailyDataQuery,
} from '../inputs';
import { PersonalAccountDailyDataEditOutput, PersonalAccountDailyDataOutput } from '../outputs';
import { PersonalAccountMonthlyDataRepositoryService, PersonalAccountRepositoryService } from '../repository';

@Injectable()
export class PersonalAccountDailyService {
	constructor(
		private readonly personalAccountRepositoryService: PersonalAccountRepositoryService,
		private readonly personalAccountMonthlyDataRepositoryService: PersonalAccountMonthlyDataRepositoryService
	) {}

	async getPersonalAccountDailyData(
		input: PersonalAccountDailyDataQuery,
		userId: string
	): Promise<PersonalAccountDailyDataOutput[]> {
		const personalAccount = await this.personalAccountRepositoryService.getPersonalAccountByUserId(userId);
		const monthlyData = await this.personalAccountMonthlyDataRepositoryService.getMonthlyDataByYearAndMont(
			input.personalAccountId,
			input.year,
			input.month
		);

		if (!personalAccount || !monthlyData) {
			return [];
		}

		// create correct returning object
		const transformedDailyData: PersonalAccountDailyDataOutput[] = monthlyData.dailyData.map((d) => {
			const personalAccountTag = personalAccount.personalAccountTag.find((tag) => tag.id === d.tagId);
			return { ...d, tag: personalAccountTag };
		});

		return transformedDailyData;
	}

	/**
	 * From the PersonalAccountDailyDataCreate.date we calculate what year and month monthlyData
	 * we are working with.
	 *
	 * @param input {PersonalAccountDailyDataCreate} input data to create {PersonalAccountDailyData}
	 * @param userId {string} of the user who to associate the new PersonalAccountDailyData
	 * @returns newly created PersonalAccountDailyData
	 */
	async createPersonalAccountDailyEntry(
		input: PersonalAccountDailyDataCreate,
		userId: string
	): Promise<PersonalAccountDailyDataOutput> {
		const inputDate = new Date(input.date);
		const uuid = SharedServiceUtil.getUUID();

		// calculate date details
		const { year, month, week } = MomentServiceUtil.getDetailsInformationFromDate(inputDate);

		// load monthly data to which we want to register the dailyData
		let monthlyData = await this.personalAccountMonthlyDataRepositoryService.getMonthlyDataByYearAndMont(
			input.personalAccountId,
			year,
			month
		);
		const isMonthlyDataExist = !!monthlyData;

		// create new monthly data for the new daily data
		if (!isMonthlyDataExist) {
			monthlyData = await this.personalAccountMonthlyDataRepositoryService.createMonthlyData(
				input.personalAccountId,
				userId,
				year,
				month
			);
		}

		// create entry
		const dailyData: PersonalAccountDailyData = {
			id: uuid,
			userId: userId,
			tagId: input.tagId,
			description: input.description,
			monthlyDataId: monthlyData.id,
			personalAccountId: input.personalAccountId,
			value: input.value,
			week: week,
			date: inputDate,
		};

		// save entry
		await this.personalAccountMonthlyDataRepositoryService.updateMonthlyData(monthlyData.id, {
			dailyData: [...monthlyData.dailyData, dailyData],
		});

		// transform & return
		const transformedData = await this.transformDailyDataToOutput(dailyData);
		return transformedData;
	}

	/**
	 * Using approach of deleting and creating a new daily data, because we may have a situation where
	 * we want to change PersonalAccountDailyData.date to a different month than we are in
	 *
	 * Because we store in the DB an array of daily data for each PersonalAccountMonthlyData, when
	 * date change to a different month, we need to remove the dailyData from the current month
	 * and save it to the different one
	 *
	 * @param input
	 * @param userId
	 * @returns
	 */
	async editPersonalAccountDailyEntry(
		input: PersonalAccountDailyDataEdit,
		userId: string
	): Promise<PersonalAccountDailyDataEditOutput> {
		// remove old daily data
		const deletedDailyData = await this.deletePersonalAccountDailyEntry(input.dailyDataDelete, userId);
		const deletedDailyDataOutput = await this.transformDailyDataToOutput(deletedDailyData);

		// new daily data
		const newDailyData = await this.createPersonalAccountDailyEntry(input.dailyDataCreate, userId);
		const newDailyDataOutput = await this.transformDailyDataToOutput(newDailyData);

		// return edited entry
		return { originalDailyData: deletedDailyDataOutput, modifiedDailyData: newDailyDataOutput };
	}

	/**
	 * Loads monthlyData entry and filter out the monthlyData.dailyData that doesn't match its ID
	 *
	 * @param param0 {PersonalAccountDailyDataDelete} input data to remove PersonalAccountDailyData
	 * @param userId
	 * @returns the removed PersonalAccountDailyData
	 */
	async deletePersonalAccountDailyEntry(
		{ dailyDataId, monthlyDataId }: PersonalAccountDailyDataDelete,
		userId: string
	): Promise<PersonalAccountDailyDataOutput> {
		const monthlyData = await this.personalAccountMonthlyDataRepositoryService.getMonthlyDataById(
			monthlyDataId,
			userId
		);

		if (!monthlyData) {
			throw new HttpException(PERSONAL_ACCOUNT_ERROR_MONTHLY_DATA.NOT_FOUND, HttpStatus.NOT_FOUND);
		}

		// find the daily data we want to remove
		const dailyData = monthlyData.dailyData.find((d) => d.id === dailyDataId);

		// daily data not found, return error message to the user
		if (!dailyData) {
			throw new HttpException(PERSONAL_ACCOUNT_ERROR_DAILY_DATA.NOT_FOUND, HttpStatus.INTERNAL_SERVER_ERROR);
		}

		// prevent deleting someone else daily data
		if (dailyData.userId !== userId) {
			throw new HttpException(PERSONAL_ACCOUNT_ERROR_DAILY_DATA.INCORRECT_USER_ID, HttpStatus.FORBIDDEN);
		}

		// filter array that doesn't match dailyDataId
		const filteredDailyData = monthlyData.dailyData.filter((d) => d.id !== dailyDataId);

		// update daily data
		await this.personalAccountMonthlyDataRepositoryService.updateMonthlyData(monthlyDataId, {
			dailyData: filteredDailyData,
		});

		// transform & return
		const transformedData = await this.transformDailyDataToOutput(dailyData);
		return transformedData;
	}

	/**
	 *
	 * @param data
	 * @returns output of the data that contains the associated tag object
	 */
	private async transformDailyDataToOutput(data: PersonalAccountDailyData): Promise<PersonalAccountDailyDataOutput> {
		const personalAccount = await this.personalAccountRepositoryService.getPersonalAccountByIdStrict(
			data.personalAccountId
		);
		const personalAccountTag = personalAccount.personalAccountTag.find((d) => d.id === data.tagId);
		return { ...data, tag: personalAccountTag };
	}
}

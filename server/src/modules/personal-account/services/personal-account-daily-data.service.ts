import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { PubSubEngine } from 'graphql-subscriptions';
import { PUB_SUB } from '../../../graphql/graphql.types';
import { PrismaService } from '../../../prisma';
import { MomentServiceUtil, SharedServiceUtil } from '../../../utils';
import { CREATED_MONTHLY_DATA, PERSONAL_ACCOUNT_ERROR_DAILY_DATA, PERSONAL_ACCOUNT_ERROR_MONTHLY_DATA } from '../dto';
import { PersonalAccountDailyData } from '../entities';
import {
	PersonalAccountDailyDataCreate,
	PersonalAccountDailyDataDelete,
	PersonalAccountDailyDataEdit,
} from '../inputs';
import { PersonalAccountDailyDataEditOutput } from '../outputs';
import { PersonalAccountTagService } from './personal-account-tag.service';

@Injectable()
export class PersonalAccountDailyService {
	constructor(
		private prisma: PrismaService,
		private personalAccountTagService: PersonalAccountTagService,
		@Inject(PUB_SUB) private pubSub: PubSubEngine
	) {}

	/**
	 * From the PersonalAccountDailyDataCreate.date we calculate what year and month monthlyData
	 * we are working with.
	 * If monthly data does not exist, create one - user may add entry to the future
	 *
	 * @param input {PersonalAccountDailyDataCreate} input data to create {PersonalAccountDailyData}
	 * @param userId {string} of the user who to associate the new PersonalAccountDailyData
	 * @returns newly created PersonalAccountDailyData
	 */
	async createPersonalAccountDailyEntry(
		input: PersonalAccountDailyDataCreate,
		userId: string
	): Promise<PersonalAccountDailyData> {
		const inputDate = new Date(input.date);
		const uuid = SharedServiceUtil.getUUID();

		// calculate date details
		const { year, month, week } = MomentServiceUtil.getDetailsInformationFromDate(inputDate);

		// load monthly data to which we want to register the dailyData
		let monthlyData = await this.prisma.personalAccountMonthlyData.findFirst({
			where: {
				personalAccountId: input.personalAccountId,
				year,
				month,
			},
		});
		const isMonthlyDataExist = !!monthlyData;

		// create new monthly data for the new daily data
		if (!isMonthlyDataExist) {
			monthlyData = await this.prisma.personalAccountMonthlyData.create({
				data: {
					personalAccountId: input.personalAccountId,
					userId,
					year,
					month,
					dailyData: [],
				},
			});
		}

		// create entry
		const dailyData: PersonalAccountDailyData = {
			id: uuid,
			userId: userId,
			tagId: input.tagId,
			monthlyDataId: monthlyData.id,
			value: input.value,
			week: week,
			date: inputDate,
		};

		// save entry
		const monthlyDataPublish = await this.prisma.personalAccountMonthlyData.update({
			data: {
				dailyData: {
					push: [dailyData],
				},
			},
			where: {
				id: monthlyData.id,
			},
		});

		// subscriptions to publish information about newly created monthly data
		if (!isMonthlyDataExist) {
			this.pubSub.publish(CREATED_MONTHLY_DATA, { [CREATED_MONTHLY_DATA]: monthlyDataPublish });
		}

		return dailyData;
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

		// new daily data
		const newDailyData = await this.createPersonalAccountDailyEntry(input.dailyDataCreate, userId);

		// return edited entry
		return { originalDailyData: deletedDailyData, modifiedDailyData: newDailyData };
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
	): Promise<PersonalAccountDailyData> {
		const monthlyData = await this.prisma.personalAccountMonthlyData.findFirst({
			where: {
				id: monthlyDataId,
			},
		});

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

		// filter array that doesnt match dailyDataId
		const filteredDailyData = monthlyData.dailyData.filter((d) => d.id !== dailyDataId);

		// update daily data
		await this.prisma.personalAccountMonthlyData.update({
			data: {
				dailyData: filteredDailyData,
			},
			where: {
				id: monthlyDataId,
			},
		});

		// return removed entry
		return dailyData;
	}
}

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { MomentServiceUtil, SharedServiceUtil } from './../../../utils';
import { PersonalAccountDailyData } from './entities';
import { PersonalAccountDailyDataCreate, PersonalAccountDailyDataDelete, PersonalAccountDailyDataEdit } from './inputs';
import { PersonalAccountDailyDataEditOutput } from './outputs';

@Injectable()
export class PersonalAccountDailyService {
	constructor(private prisma: PrismaService) {}

	async createPersonalAccountDailyEntry(
		input: PersonalAccountDailyDataCreate,
		userId: string
	): Promise<PersonalAccountDailyData> {
		try {
			const inputDate = new Date(input.date);
			const uuid = SharedServiceUtil.getUUID();
			// calculate date details
			const { year, month, week } = MomentServiceUtil.getDetailsInformationFromDate(inputDate);

			// load monthly data to which we want to register the dailyData
			const monthlyData = await this.prisma.personalAccountMonthlyData.findFirst({
				where: {
					personalAccountId: input.personalAccountId,
					year,
					month,
				},
			});

			// month not found, adding too soon or too in the future
			if (!monthlyData) {
				throw new HttpException(
					`Unable to found associated month. Can not add daily entry before you used the service, or in the future months`,
					HttpStatus.NOT_FOUND
				);
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
			await this.prisma.personalAccountMonthlyData.update({
				data: {
					dailyData: {
						push: [dailyData],
					},
				},
				where: {
					id: monthlyData.id,
				},
			});

			return dailyData;
		} catch (e) {
			console.error(e);
			throw new HttpException(`Error happened, unable to create personal entry`, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	// TODO test functionality to pass on different month
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
		const deletedDailyData = await this.deletePersonalAccountDailyEntry(input.originalDailyData, userId);

		// new daily data
		const newDailyData = await this.createPersonalAccountDailyEntry(input.modifiedDailyData, userId);

		// return edited entry
		return { originalDailyData: deletedDailyData, modifiedDailyData: newDailyData };
	}

	async deletePersonalAccountDailyEntry(
		{ dailyDataId, monthlyDataId }: PersonalAccountDailyDataDelete,
		userId: string
	): Promise<PersonalAccountDailyData> {
		const monthlyData = await this.prisma.personalAccountMonthlyData.findFirst({
			where: {
				id: monthlyDataId,
			},
		});

		// find the daily data we want to remove
		const dailyData = monthlyData.dailyData.find((d) => d.id === dailyDataId);

		// daily data not found, return error message to the user
		if (!dailyData) {
			throw new HttpException(
				`Daily entry for personal account is not found, can not be deleted`,
				HttpStatus.INTERNAL_SERVER_ERROR
			);
		}

		// prevent deleting someone else daily data
		if (dailyData.userId !== userId) {
			throw new HttpException(
				`Daily entry for personal account can not be removed, requester does not match the person who has created the entry`,
				HttpStatus.FORBIDDEN
			);
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

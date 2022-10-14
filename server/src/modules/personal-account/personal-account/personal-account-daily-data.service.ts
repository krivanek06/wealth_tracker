import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { MomentServiceUtil, SharedServiceUtil } from './../../../utils';
import { PersonalAccountDailyDataCreate, PersonalAccountDailyDataDelete } from './dto';
import { PersonalAccountDailyData } from './entity';

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

			// create entry
			const dailyData: PersonalAccountDailyData = {
				id: uuid,
				userId: userId,
				tagId: input.tagId,
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

	// TODO
	// async editPersonalAccountDailyEntry(input: PersonalAccountDailyDataEdit): Promise<PersonalAccountDailyData> {
	// 	// TODO load monthly data
	// 	// TODO check if PersonalAccountDailyData.date exists, if not keep old date
	// 	// TODO update daily data in array
	// }

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

		return dailyData;
	}
}

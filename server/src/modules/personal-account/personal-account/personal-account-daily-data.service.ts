import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { MomentServiceUtil, SharedServiceUtil } from './../../../utils';
import { PersonalAccountDailyDataCreate } from './dto';
import { PersonalAccountDailyData } from './entity';
import { PersonalAccountMonthlyService } from './personal-account-monthly.service';

@Injectable()
export class PersonalAccountDailyService {
	constructor(private prisma: PrismaService, private personalAccountMonthlyService: PersonalAccountMonthlyService) {}

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
			const monthlyData = await this.personalAccountMonthlyService.getMonthlyDataByAccountIdFirst(
				input.personalAccountId,
				year,
				month
			);

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
}

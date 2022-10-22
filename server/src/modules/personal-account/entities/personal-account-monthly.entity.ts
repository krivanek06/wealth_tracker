import { Field, Int, ObjectType } from '@nestjs/graphql';
import { PersonalAccountMonthlyData as PersonalAccountMonthlyDataClient } from '@prisma/client';
import { PersonalAccountDailyData } from './personal-account-daily-data.entity';

@ObjectType()
export class PersonalAccountMonthlyData implements PersonalAccountMonthlyDataClient {
	@Field(() => String)
	id: string;

	@Field(() => String, {
		description: 'Id of user whose to belong this personal monthly data',
	})
	userId: string;

	@Field(() => String, {
		description: 'Reference to PersonalAccount.id',
	})
	personalAccountId: string;

	@Field(() => Int, {
		description: 'To which month in a year is this account change associated. Like 8 for September',
	})
	month: number;

	@Field(() => Int, {
		description: 'To which year is this account change associated.',
	})
	year: number;

	@Field(() => [PersonalAccountDailyData], {
		description: 'List of daily expenses user has made during this month period',
	})
	dailyData: PersonalAccountDailyData[];
}

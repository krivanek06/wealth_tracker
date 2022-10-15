import { ArgsType, Field, InputType } from '@nestjs/graphql';
import { IsObject } from 'class-validator';
import { PersonalAccountDailyDataCreate } from './personal-account-daily-data-create.input';
import { PersonalAccountDailyDataDelete } from './personal-account-daily-data-delete.input';

/**
 * Using oldDailyData and newDailyData for the reason because how it is saved in the database
 *
 * Each PersonalAccountMonthlyData has an array of daily data entries, but if the user changes
 * the date of the daily data to another month, we have to remove that daily data from the current
 * PersonalAccountMonthlyData.dailyData array and save it to the one that match the new date
 */
@InputType()
@ArgsType()
export class PersonalAccountDailyDataEdit {
	@Field(() => PersonalAccountDailyDataDelete, {
		description: 'Original daily data we want to edit',
	})
	@IsObject()
	originalDailyData: PersonalAccountDailyDataDelete;

	@Field(() => PersonalAccountDailyDataCreate, {
		description: 'New daily data we want to save',
	})
	@IsObject()
	modifiedDailyData: PersonalAccountDailyDataCreate;
}

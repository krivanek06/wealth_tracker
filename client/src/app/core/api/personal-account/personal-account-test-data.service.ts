import { Injectable, inject } from '@angular/core';
import { addDays, format, subDays } from 'date-fns';
import { environment } from 'src/environments/environment';
import { getRandomItemFromList, getRandomNumber } from '../../utils';
import { PersonalAccountDailyDataCreate } from './personal-account-types.model';
import { PersonalAccountService } from './personal-account.service';

@Injectable({
	providedIn: 'root',
})
export class PersonalAccountTestDataService {
	private personalAccountService = inject(PersonalAccountService);

	async populateData(): Promise<void> {
		if (environment.production) {
			console.log('Not in production, not populating data');
			return;
		}

		const usedDays = 140; // go back N days
		const startingDate = format(subDays(new Date(), usedDays), 'yyyy-MM-dd');

		// create data for the last 6 months
		for (let i = 0; i < usedDays; i++) {
			const currentDate = format(addDays(startingDate, i), 'yyyy-MM-dd');
			const randomDataNumber = getRandomNumber(1, 2);

			console.log('currentDate', currentDate);

			const data = this.getDataForDate(currentDate, randomDataNumber);
			console.log('data', data);
			for await (const entry of data) {
				await this.personalAccountService.createPersonalAccountDailyEntry(entry);
			}

			//await sleepSeconds(0.5);
		}

		console.log('SEEDING IS DONE');
	}

	/**
	 * @param dataNumber - how many data to generate for each day
	 * @returns - array of PersonalAccountDailyDataCreateNew
	 */
	private getDataForDate(usedDate: string, dataNumber: number = 5): PersonalAccountDailyDataCreate[] {
		const result: PersonalAccountDailyDataCreate[] = [];
		for (let i = 0; i <= dataNumber; i++) {
			const randomTagId = getRandomItemFromList(this.personalAccountService.personalAccountTagsSignal()).id;
			const value = getRandomNumber(12, 75);

			const data: PersonalAccountDailyDataCreate = {
				date: usedDate,
				tagId: randomTagId,
				value: value,
			};

			result.push(data);
		}

		return [...result];
	}
}

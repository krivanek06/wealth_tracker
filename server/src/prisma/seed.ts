import { addDays } from 'date-fns';
import { PersonalAccount } from './../modules/personal-account/entities/personal-account.entity';
import { PersonalAccountCreateInput } from './../modules/personal-account/inputs/personal-account-create.input';
import { PersonalAccountDailyDataCreate } from './../modules/personal-account/inputs/personal-account-daily-data-create.input';
import { PersonalAccountDailyService } from './../modules/personal-account/services/personal-account-daily-data.service';
import { PersonalAccountMonthlyService } from './../modules/personal-account/services/personal-account-monthly.service';
import { PersonalAccountTagService } from './../modules/personal-account/services/personal-account-tag.service';
import { PersonalAccountService } from './../modules/personal-account/services/personal-account.service';

import { PrismaService } from './prisma.service';

const prisma = new PrismaService();
const personalAccountDailyService = new PersonalAccountDailyService(prisma);
const personalAccountTagService = new PersonalAccountTagService(prisma);
const personalAccountMonthlyService = new PersonalAccountMonthlyService(prisma, personalAccountTagService);
const personalAccountService = new PersonalAccountService(prisma, personalAccountMonthlyService);

const USER_ID = '63457ee2bb8dd0d311fbbe2b';

const getPersonalAccount = async (): Promise<PersonalAccount> => {
	// remove previous
	const accounts = await personalAccountService.getPersonalAccounts(USER_ID);

	if (accounts.length > 0) {
		return accounts[0];
	}

	const input: PersonalAccountCreateInput = {
		name: 'Test account One',
	};
	return personalAccountService.createPersonalAccount(input, USER_ID);
};

const randomIntFromInterval = (min: number, max: number) => {
	return Math.floor(Math.random() * (max - min + 1) + min);
};

const createDailyData = async (accunt: PersonalAccount): Promise<void> => {
	const defaultTags = personalAccountTagService.getDefaultTags();

	// for each day
	for (let i = 0; i < 100; i++) {
		const randomDailyEntries = randomIntFromInterval(2, 5);
		console.log(`Daily data: ${i}, entities: ${randomDailyEntries}`);
		const today = addDays(new Date('2022-08-01'), i);

		// for each daily entry
		for (let j = 0; j < randomDailyEntries; j++) {
			const randomTagIndex = randomIntFromInterval(0, defaultTags.length - 1);
			const randomTag = defaultTags[randomTagIndex];

			const input: PersonalAccountDailyDataCreate = {
				date: today.toISOString(),
				personalAccountId: accunt.id,
				tagId: randomTag.id,
				value: randomIntFromInterval(11, 66),
			};

			await personalAccountDailyService.createPersonalAccountDailyEntry(input, USER_ID);
		}
	}
};

const run = async () => {
	try {
		console.log('[Personal account] GET');
		const personalAcc = await getPersonalAccount();
		console.log(`[Personal account]: ID: ${personalAcc.id} - NAME: ${personalAcc.name}`);
		console.log('[Personal account daily data] -> start');
		await createDailyData(personalAcc);
		console.log('[Personal account daily data] -> end');
	} catch (e) {
		console.log(e);
	} finally {
		prisma.$disconnect();
	}
};

run();

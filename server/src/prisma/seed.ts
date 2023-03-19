import { addDays } from 'date-fns';
import { PubSub } from 'graphql-subscriptions';
import { PersonalAccountCreateInput } from '../modules/personal-account/inputs/personal-account.input';
import { PersonalAccount } from './../modules/personal-account/entities/personal-account.entity';
import { PersonalAccountDailyDataCreate } from './../modules/personal-account/inputs/personal-account-daily-data-create.input';
import { PersonalAccountMonthlyDataRepositoryService } from './../modules/personal-account/repository/personal-account-monthly-data-repository.service';
import { PersonalAccountRepositoryService } from './../modules/personal-account/repository/personal-account-repository.service';
import { PersonalAccountDailyService } from './../modules/personal-account/services/personal-account-daily-data.service';
import { PersonalAccountMonthlyService } from './../modules/personal-account/services/personal-account-monthly.service';
import { PersonalAccountTagService } from './../modules/personal-account/services/personal-account-tag.service';
import { PersonalAccountService } from './../modules/personal-account/services/personal-account.service';
import { StorageFilesService } from './../providers/storage-files/storage-files.service';

import { PrismaService } from './prisma.service';

const prisma = new PrismaService();
const pubsub = new PubSub();
const storageFilesService = new StorageFilesService();

const personalAccountRepo = new PersonalAccountRepositoryService(prisma);
const personalAccountMonthlyRepo = new PersonalAccountMonthlyDataRepositoryService(prisma);

const personalAccountTagService = new PersonalAccountTagService(personalAccountRepo, storageFilesService);
const personalAccountDailyService = new PersonalAccountDailyService(personalAccountRepo, personalAccountMonthlyRepo);
const personalAccountMonthlyService = new PersonalAccountMonthlyService(
	personalAccountMonthlyRepo,
	personalAccountRepo
);
const personalAccountService = new PersonalAccountService(personalAccountRepo);

const USER_ID = '63457ee3bb8dd0d311fbbe33';

const getPersonalAccount = async (): Promise<PersonalAccount> => {
	// remove previous
	try {
		const accounts = await personalAccountService.getPersonalAccountByUserId(USER_ID);
		return accounts;
	} catch {
		const input: PersonalAccountCreateInput = {
			name: 'Test account One',
		};
		return personalAccountService.createPersonalAccount(input, USER_ID);
	}
};

const randomIntFromInterval = (min: number, max: number) => {
	return Math.floor(Math.random() * (max - min + 1) + min);
};

const personalAccountCreateDailyData = async (account: PersonalAccount): Promise<void> => {
	const defaultTags = account.personalAccountTag;
	// console.log(defaultTags);

	// for each day
	for (let i = 0; i < 220; i++) {
		const randomDailyEntries = randomIntFromInterval(2, 5);
		console.log(`Daily data: ${i}, entities: ${randomDailyEntries}`);
		const today = addDays(new Date('2022-08-01'), i);

		// for each daily entry
		for (let j = 0; j < randomDailyEntries; j++) {
			const randomTagIndex = randomIntFromInterval(0, defaultTags.length - 1);
			const randomTag = defaultTags[randomTagIndex];

			const input: PersonalAccountDailyDataCreate = {
				date: today.toISOString(),
				description: '',
				tagId: randomTag.id,
				value: randomIntFromInterval(11, 66),
			};

			await personalAccountDailyService.createPersonalAccountDailyEntry(input, USER_ID);
		}
	}
};

const personalAccountDeleteMonthlyData = async (account: PersonalAccount): Promise<void> => {
	const monthlyData = await prisma.personalAccountMonthlyData.findMany({
		where: {
			personalAccountId: account.id,
		},
	});
	for await (const data of monthlyData) {
		await prisma.personalAccountMonthlyData.delete({
			where: {
				id: data.id,
			},
		});
		console.log(`[Personal account DELETE] Monthly data: ${data.personalAccountId}`);
	}
};

const run = async () => {
	try {
		console.log('[Personal account] ----- START');

		console.log('[Personal account] GET');
		const personalAcc = await getPersonalAccount();
		console.log(`[Personal account]: ID: ${personalAcc.id} - NAME: ${personalAcc.name}`);
		console.log('[Personal account DELETE] -> daily data start');
		await personalAccountDeleteMonthlyData(personalAcc);
		console.log('[Personal account CREATE] -> daily data start');
		await personalAccountCreateDailyData(personalAcc);
		console.log('[Personal account CREATE] -> daily data end');

		console.log('[Personal account] ----- END');

		// console.log('[Investment account] ----- START');

		// console.log('[Investment account] ----- END');
	} catch (e) {
		console.log(e);
	} finally {
		prisma.$disconnect();
	}
};

run();

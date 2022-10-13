import * as faker from '@faker-js/faker';
import { PersonalAccountTagDataType, PrismaClient } from '@prisma/client';
import { PersonalAccountDailyDataCreate } from './../src/modules/personal-account/personal-account-monthly/dto/';
import { PersonalAccountTagDataCreate } from './../src/modules/personal-account/personal-account-tag/dto/';
import { AccountType, PersonalAccountCreateInput } from './../src/modules/personal-account/personal-account/dto/';

const prisma = new PrismaClient();

const getRandomInt = (min: number, max: number) => {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

const createManyUsers = async (): Promise<void> => {
	// remove previous users
	try {
		if ((await prisma.user.count()) > 0) {
			await prisma.user.deleteMany();
		}
	} catch (err) {
		console.log('Users: Unable to remove previous data, stopping operation');
		return;
	}

	for (let i = 0; i < 10; i++) {
		await prisma.user.create({
			data: {
				email: i % 4 ? null : faker.faker.internet.email(),
				imageUrl: faker.faker.internet.avatar(),
				username: faker.faker.internet.userName(),
				authentication: {
					authenticationType: 'BASIC_AUTH',
					password: 'abc123',
				},
			},
		});
	}
};

const createDefaultTags = async (): Promise<void> => {
	try {
		if ((await prisma.personalAccountTag.count()) > 0) {
			await prisma.personalAccountTag.deleteMany();
		}
	} catch (err) {
		console.log('Tags: Unable to remove previous data, stopping operation');
		return;
	}

	// Default expense tags
	for (let i = 0; i < 10; i++) {
		const tagDefaultExpense: PersonalAccountTagDataCreate = {
			name: `Spending_${1}`,
			type: PersonalAccountTagDataType.EXPENSE,
		};

		await prisma.personalAccountTag.create({
			data: {
				...tagDefaultExpense,
				isDefault: true,
			},
		});
	}

	// Default income tags
	for (let i = 0; i < 3; i++) {
		const tagDefaultIncome: PersonalAccountTagDataCreate = {
			name: `Income_${1}`,
			type: PersonalAccountTagDataType.INCOME,
		};

		await prisma.personalAccountTag.create({
			data: {
				...tagDefaultIncome,
				isDefault: true,
			},
		});
	}
};

const createPersonalAccount = async (): Promise<void> => {
	// remove previous data
	try {
		if ((await prisma.personalAccount.count()) > 0) {
			await prisma.personalAccount.deleteMany();
			await prisma.personalAccountMonthlyData.deleteMany();
		}
	} catch (err) {
		console.log('Personal account: Unable to remove previous data, stopping operation');
		return;
	}

	// prepare objects
	const testUser = await prisma.user.findFirst();
	const expenseTag1 = await prisma.personalAccountTag.findFirst({
		where: {
			type: 'EXPENSE',
		},
	});
	const expenseTag2 = await prisma.personalAccountTag.findFirst({
		where: {
			type: 'EXPENSE',
		},
		skip: 2,
	});
	const incomeTag1 = await prisma.personalAccountTag.findFirst({
		where: {
			type: 'INCOME',
		},
	});

	const personalAccountInput: PersonalAccountCreateInput = {
		name: 'Personal account 11',
		type: AccountType.PERSONAL,
	};

	// create personal account
	const personalAccount = await prisma.personalAccount.create({
		data: {
			name: personalAccountInput.name,
			userId: testUser.id,
		},
	});

	// create new month -> will be done by cloud funtions
	const MONTH_8_2022 = await prisma.personalAccountMonthlyData.create({
		data: {
			year: 2022,
			month: 8,
			dailyData: [],
			personalAccountId: personalAccount.id,
		},
	});
	const MONTH_9_2022 = await prisma.personalAccountMonthlyData.create({
		data: {
			year: 2022,
			month: 9,
			dailyData: [],
			personalAccountId: personalAccount.id,
		},
	});
	const MONTH_9_2023 = await prisma.personalAccountMonthlyData.create({
		data: {
			year: 2023,
			month: 9,
			dailyData: [],
			personalAccountId: personalAccount.id,
		},
	});

	const CURRENT_WEEK_TEST = 37;
	const dailyData1: PersonalAccountDailyDataCreate & { week: number; userId: string } = {
		value: 15.5,
		userId: testUser.id,
		tagId: expenseTag1.id,
		week: CURRENT_WEEK_TEST,
	};
	const dailyData2: PersonalAccountDailyDataCreate & { week: number; userId: string } = {
		value: 12.5,
		tagId: expenseTag1.id,
		week: CURRENT_WEEK_TEST,
		userId: testUser.id,
	};
	const dailyData3: PersonalAccountDailyDataCreate & { week: number; userId: string } = {
		value: 10.5,
		tagId: expenseTag2.id,
		week: CURRENT_WEEK_TEST,
		userId: testUser.id,
	};
	const dailyData1Income: PersonalAccountDailyDataCreate & { week: number; userId: string } = {
		value: 100,
		tagId: incomeTag1.id,
		week: CURRENT_WEEK_TEST,
		userId: testUser.id,
	};

	// persis expenses & incomes
	await prisma.personalAccountMonthlyData.update({
		data: {
			dailyData: {
				push: [dailyData1, dailyData2, dailyData3, dailyData1Income],
			},
		},
		where: {
			id: MONTH_8_2022.id,
		},
	});
	await prisma.personalAccountMonthlyData.update({
		data: {
			dailyData: {
				push: [dailyData1, dailyData2],
			},
		},
		where: {
			id: MONTH_9_2022.id,
		},
	});
	await prisma.personalAccountMonthlyData.update({
		data: {
			dailyData: {
				push: [dailyData1, dailyData2, dailyData1Income],
			},
		},
		where: {
			id: MONTH_9_2023.id,
		},
	});

	// TODO calculate PersonalAccountWeeklyAggregation based on each dailyData entry
	// const data = await prisma.personalAccountMonthlyData.groupBy({
	// 	by: ['year', 'month'],
	// });
	// data.
};

// const createInvestmentAccount = async (): Promise<void> => {
// 	if ((await prisma.investmentAccount.count()) !== 0) {
// 		return;
// 	}

// 	const testUser = await prisma.user.findFirst();
// 	const investmentAccount: AccountCreateInput = {
// 		name: 'Investment account 222',
// 		type: AccountType.INVESTTMENT,
// 	};
// };

const run = async () => {
	const prisma = new PrismaClient();
	try {
		console.log('Prisma: connecting');
		await prisma.$connect();

		console.log('creating users () -> start');
		await createManyUsers();
		console.log('creating users () -> done');

		console.log('====');

		console.log('creating default tags () -> start');
		await createDefaultTags();
		console.log('creating default tags () -> done');

		console.log('====');

		console.log('creating personal account () -> start');
		await createPersonalAccount();
		console.log('creating personal account () -> done');
	} catch (err) {
		console.log(err);
	} finally {
		await prisma.$disconnect();
	}
};

run();

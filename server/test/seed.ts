import * as faker from '@faker-js/faker';
import { PersonalAccountTagDataType, PrismaClient } from '@prisma/client';
import { PersonalAccountTagDataCreate, UserCreate } from './../src/modules';

const prisma = new PrismaClient();

const getRandomInt = (min: number, max: number) => {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

const createManyUsers = async (): Promise<void> => {
	if ((await prisma.user.count()) !== 0) {
		return;
	}

	for (let i = 0; i < 10; i++) {
		const user: UserCreate = {
			email: faker.faker.internet.email(),
			imageUrl: faker.faker.internet.avatar(),
			username: faker.faker.internet.userName(),
		};

		await prisma.user.create({
			data: {
				...user,
			},
		});
	}
};

const createDefaultTags = async (): Promise<void> => {
	if ((await prisma.personalAccountTag.count()) !== 0) {
		return;
	}

	// create collection
	const collection = await prisma.personalAccountTag.create({
		data: {
			total: 0,
			data: [],
			isDefault: true,
		},
	});
	const TAG_DEFAULT_ID = collection.id;

	// Default expense tags
	for (let i = 0; i < 10; i++) {
		const tagDefaultExpense: PersonalAccountTagDataCreate & { id: string } = {
			id: new Date().toISOString() + getRandomInt(1, 40),
			name: `Spending_${1}`,
			type: PersonalAccountTagDataType.EXPENSE,
		};

		await prisma.personalAccountTag.update({
			data: {
				total: {
					increment: 1,
				},
				data: {
					push: tagDefaultExpense,
				},
			},
			where: {
				id: TAG_DEFAULT_ID,
			},
		});
	}

	// Default income tags
	for (let i = 0; i < 3; i++) {
		const tagDefaultIncome: PersonalAccountTagDataCreate & { id: string } = {
			id: new Date().toISOString() + getRandomInt(1, 40),
			name: `Income_${1}`,
			type: PersonalAccountTagDataType.INCOME,
		};

		await prisma.personalAccountTag.update({
			data: {
				total: {
					increment: 1,
				},
				data: {
					push: tagDefaultIncome,
				},
			},
			where: {
				id: TAG_DEFAULT_ID,
			},
		});
	}
};

const run = async () => {
	const prisma = new PrismaClient();
	try {
		console.log('creating users () -> start');
		await createManyUsers();
		console.log('creating users () -> done');

		console.log('====');

		console.log('creating default tags () -> start');
		await createDefaultTags();
		console.log('creating default tags () -> done');
	} finally {
		await prisma.$disconnect();
	}
};

run();

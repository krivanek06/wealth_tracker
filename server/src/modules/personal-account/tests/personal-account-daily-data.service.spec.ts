import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { MomentServiceUtil, SharedServiceUtil } from './../../../utils';

import { when } from 'jest-when';
import { PersonalAccountDailyData, PersonalAccountMonthlyData } from '../entities';

import { PrismaService } from '../../../prisma';
import { PERSONAL_ACCOUNT_ERROR_DAILY_DATA, PERSONAL_ACCOUNT_ERROR_MONTHLY_DATA } from '../dto';
import {
	PersonalAccountDailyDataCreate,
	PersonalAccountDailyDataDelete,
	PersonalAccountDailyDataEdit,
} from '../inputs';
import { PersonalAccountDailyDataEditOutput } from '../outputs';
import { PersonalAccountDailyService } from '../services';

describe('PersonalAccountDailyService', () => {
	let service: PersonalAccountDailyService;
	const TEST_PERSONAL_ACCOUNT_ID = 'ABC123PMLLL';
	const MOCK_UUID = 'UUID_TEST_1234';
	const MOCK_USER_ID = 'USER_1234';

	const TEST_DATE_NOV = 'Fri Nov 14 2022 10:40:06 GMT+0300';
	const TEST_DATE_NOV_DETAILS = MomentServiceUtil.getDetailsInformationFromDate(TEST_DATE_NOV);

	const TEST_DATE_OCT = 'Fri Oct 14 2022 10:40:06 GMT+0300';
	const TEST_DATE_OCT_DETAILS = MomentServiceUtil.getDetailsInformationFromDate(TEST_DATE_OCT);

	const TEST_DATE_SEP = 'Fri Sep 14 2022 10:40:06 GMT+0300';
	const TEST_DATE_SEP_DETAILS = MomentServiceUtil.getDetailsInformationFromDate(TEST_DATE_SEP);

	// daily data
	const TEST_DAILY_DATA_OCT_1: PersonalAccountDailyData = {
		id: 'TEST_DAILY_DATA_OCT_1',
		value: 10,
		userId: MOCK_USER_ID,
		date: new Date(TEST_DATE_OCT),
		tagId: 'TEST_DAILY_DATA_1_TAG_1',
		monthlyDataId: 'TEST_MONTHLY_OCT',
		week: 42,
	};
	const TEST_DAILY_DATA_OCT_2: PersonalAccountDailyData = {
		id: 'TEST_DAILY_DATA_OCT_2',
		value: 10,
		userId: MOCK_USER_ID,
		date: new Date(TEST_DATE_OCT),
		tagId: 'TEST_DAILY_DATA_2_TAG_1',
		monthlyDataId: 'TEST_MONTHLY_OCT',
		week: 42,
	};

	// monthly data
	const TEST_MONTHLY_OCT = {
		personalAccountId: TEST_PERSONAL_ACCOUNT_ID,
		id: 'TEST_MONTHLY_OCT',
		month: TEST_DATE_OCT_DETAILS.month,
		year: TEST_DATE_OCT_DETAILS.year,
		dailyData: [TEST_DAILY_DATA_OCT_1, TEST_DAILY_DATA_OCT_2],
	} as PersonalAccountMonthlyData;
	const TEST_MONTHLY_SEP = {
		personalAccountId: TEST_PERSONAL_ACCOUNT_ID,
		id: 'TEST_MONTHLY_SEP',
		month: TEST_DATE_SEP_DETAILS.month,
		year: TEST_DATE_SEP_DETAILS.year,
		dailyData: [],
	} as PersonalAccountMonthlyData;

	const TEST_MONTHLY_NOV = {
		personalAccountId: TEST_PERSONAL_ACCOUNT_ID,
		id: 'TEST_MONTHLY_NOV',
		month: TEST_DATE_NOV_DETAILS.month,
		year: TEST_DATE_NOV_DETAILS.year,
		dailyData: [],
	} as PersonalAccountMonthlyData;

	// mock prisma service
	const prismaServiceMock: PrismaService = createMock<PrismaService>({
		personalAccountMonthlyData: {
			findFirst: jest.fn(),
			// create: jest.fn(),
			update: jest.fn(),
			create: jest.fn().mockResolvedValue(TEST_MONTHLY_NOV),
		},
	});
	SharedServiceUtil.getUUID = jest.fn().mockReturnValue(MOCK_UUID);

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [PersonalAccountDailyService, { provide: PrismaService, useValue: prismaServiceMock }],
		}).compile();

		service = module.get<PersonalAccountDailyService>(PersonalAccountDailyService);

		when(prismaServiceMock.personalAccountMonthlyData.findFirst)
			// mock november
			.calledWith({
				where: {
					personalAccountId: TEST_PERSONAL_ACCOUNT_ID,
					year: TEST_MONTHLY_OCT.year,
					month: TEST_MONTHLY_OCT.month,
				},
			})
			.mockResolvedValue(TEST_MONTHLY_OCT)
			.calledWith({
				where: {
					id: TEST_MONTHLY_OCT.id,
				},
			})
			.mockResolvedValue(TEST_MONTHLY_OCT)
			// mock september
			.calledWith({
				where: {
					personalAccountId: TEST_PERSONAL_ACCOUNT_ID,
					year: TEST_MONTHLY_SEP.year,
					month: TEST_MONTHLY_SEP.month,
				},
			})
			.mockResolvedValue(TEST_MONTHLY_SEP);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('Test: createPersonalAccountDailyEntry()', () => {
		it('should create dailyData if monthly entry exists', async () => {
			// testing data for OCTOBER
			const testUserId = 'ABC1234';
			const testInputData: PersonalAccountDailyDataCreate = {
				tagId: '634a55e83d5f2180e336af5a',
				value: 10,
				personalAccountId: TEST_PERSONAL_ACCOUNT_ID,
				date: TEST_DATE_OCT,
			};
			const inputDate = new Date(TEST_DATE_OCT);

			// prepare result
			const expectedResult: PersonalAccountDailyData = {
				id: MOCK_UUID,
				userId: testUserId,
				tagId: testInputData.tagId,
				value: testInputData.value,
				monthlyDataId: TEST_MONTHLY_OCT.id,
				week: TEST_DATE_OCT_DETAILS.week,
				date: inputDate,
			};

			const result = await service.createPersonalAccountDailyEntry(testInputData, testUserId);

			// test loading October monthly data
			expect(prismaServiceMock.personalAccountMonthlyData.findFirst).toHaveBeenCalledWith({
				where: {
					personalAccountId: TEST_PERSONAL_ACCOUNT_ID,
					year: TEST_DATE_OCT_DETAILS.year,
					month: TEST_DATE_OCT_DETAILS.month,
				},
			});

			// test saving new dailyData for October
			expect(prismaServiceMock.personalAccountMonthlyData.update).toBeCalledWith({
				data: {
					dailyData: {
						push: [expectedResult],
					},
				},
				where: {
					id: TEST_MONTHLY_OCT.id,
				},
			});

			// test result
			expect(result).toStrictEqual(expectedResult);
		});

		it('should create a new monthly instace and daily entry if monthly data does not exist', async () => {
			// testing data for November
			const testInputData: PersonalAccountDailyDataCreate = {
				tagId: '634a55e83d5f2180e336af5a',
				value: 88.2,
				personalAccountId: TEST_MONTHLY_NOV.personalAccountId,
				date: TEST_DATE_NOV,
			};
			const { week, year, month } = MomentServiceUtil.getDetailsInformationFromDate(new Date(testInputData.date));

			const expectedResult: PersonalAccountDailyData = {
				id: MOCK_UUID,
				value: testInputData.value,
				userId: MOCK_USER_ID,
				date: new Date(TEST_DATE_NOV),
				tagId: testInputData.tagId,
				monthlyDataId: TEST_MONTHLY_NOV.id,
				week: week,
			};

			const result = await service.createPersonalAccountDailyEntry(testInputData, MOCK_USER_ID);

			expect(result).toStrictEqual(expectedResult);
			expect(prismaServiceMock.personalAccountMonthlyData.create).toHaveBeenCalledWith({
				data: {
					personalAccountId: TEST_MONTHLY_NOV.personalAccountId,
					userId: MOCK_USER_ID,
					year,
					month,
					dailyData: [],
				},
			});
		});
	});

	describe('Test: editPersonalAccountDailyEntry()', () => {
		it('should return removed and created PersonalAccountDailyData', async () => {
			const testInputDataCreate: PersonalAccountDailyDataCreate = {
				tagId: 'fffffffff',
				value: 15,
				personalAccountId: TEST_PERSONAL_ACCOUNT_ID,
				date: TEST_DATE_OCT,
			};
			const testInputDataDelete = {
				personalAccountId: TEST_PERSONAL_ACCOUNT_ID,
				monthlyDataId: TEST_MONTHLY_OCT.id,
				dailyDataId: TEST_DAILY_DATA_OCT_2.id,
			};
			const input: PersonalAccountDailyDataEdit = {
				dailyDataCreate: testInputDataCreate,
				dailyDataDelete: testInputDataDelete,
			};

			// results
			const originalDailyDataResult = { ...TEST_DAILY_DATA_OCT_2 };
			const modifiedDailyDataResult: PersonalAccountDailyData = {
				id: MOCK_UUID,
				value: testInputDataCreate.value,
				userId: MOCK_USER_ID,
				date: new Date(testInputDataCreate.date),
				tagId: testInputDataCreate.tagId,
				monthlyDataId: 'TEST_MONTHLY_OCT',
				week: 42,
			};
			const expectedResult: PersonalAccountDailyDataEditOutput = {
				modifiedDailyData: modifiedDailyDataResult,
				originalDailyData: originalDailyDataResult,
			};

			const deleteSpy = jest.spyOn(service, 'deletePersonalAccountDailyEntry');
			const createSpy = jest.spyOn(service, 'createPersonalAccountDailyEntry');
			const result = await service.editPersonalAccountDailyEntry(input, MOCK_USER_ID);

			expect(deleteSpy).toHaveBeenCalledWith(input.dailyDataDelete, MOCK_USER_ID);
			expect(createSpy).toHaveBeenCalledWith(input.dailyDataCreate, MOCK_USER_ID);
			expect(result).toStrictEqual(expectedResult);
		});

		it('should throw error when editing to an unexisting monthly data', () => {
			// TODO
		});
	});

	describe('Test: deletePersonalAccountDailyEntry()', () => {
		let dailyDataDelete: PersonalAccountDailyDataDelete;
		beforeEach(() => {
			dailyDataDelete = {
				personalAccountId: TEST_PERSONAL_ACCOUNT_ID,
				monthlyDataId: TEST_MONTHLY_OCT.id,
				dailyDataId: TEST_DAILY_DATA_OCT_2.id,
			};
		});

		it('should filter out dailyData from the monthlyData.dailyData array', async () => {
			const monthlyData = await prismaServiceMock.personalAccountMonthlyData.findFirst({
				where: {
					id: TEST_MONTHLY_OCT.id,
				},
			});

			// check if 2 elements are in array
			expect(monthlyData.dailyData).toHaveLength(2);
			expect(monthlyData.dailyData).toContainEqual(TEST_DAILY_DATA_OCT_1);
			expect(monthlyData.dailyData).toContainEqual(TEST_DAILY_DATA_OCT_2);

			const result = await service.deletePersonalAccountDailyEntry(dailyDataDelete, MOCK_USER_ID);

			// check if TEST_DAILY_DATA_OCT_2 was removed
			expect(result).toStrictEqual(TEST_DAILY_DATA_OCT_2);
			expect(prismaServiceMock.personalAccountMonthlyData.update).toHaveBeenCalledWith({
				data: {
					dailyData: [TEST_DAILY_DATA_OCT_1],
				},
				where: {
					id: TEST_MONTHLY_OCT.id,
				},
			});
		});

		it('should throw an error if monthly data not found', async () => {
			const otherDailyDataDeleteNotExists = {
				personalAccountId: TEST_PERSONAL_ACCOUNT_ID,
				monthlyDataId: 'TEST_MONTHLY_OCT.id',
				dailyDataId: TEST_DAILY_DATA_OCT_2.id,
			};

			await expect(
				service.deletePersonalAccountDailyEntry(otherDailyDataDeleteNotExists, MOCK_USER_ID)
			).rejects.toThrowError(PERSONAL_ACCOUNT_ERROR_MONTHLY_DATA.NOT_FOUND);
		});

		it('should throw an error if dailyData not found', async () => {
			const otherDailyDataDeleteNotExists = {
				personalAccountId: TEST_PERSONAL_ACCOUNT_ID,
				monthlyDataId: TEST_MONTHLY_OCT.id,
				dailyDataId: 'asddsa',
			};

			await expect(
				service.deletePersonalAccountDailyEntry(otherDailyDataDeleteNotExists, MOCK_USER_ID)
			).rejects.toThrowError(PERSONAL_ACCOUNT_ERROR_DAILY_DATA.NOT_FOUND);
		});

		it('should throw an error if dailyData does not match userId', async () => {
			const testOtherUserId = 'jkhafjkfdhskjf';
			await expect(service.deletePersonalAccountDailyEntry(dailyDataDelete, testOtherUserId)).rejects.toThrowError(
				PERSONAL_ACCOUNT_ERROR_DAILY_DATA.INCORRECT_USER_ID
			);
		});
	});
});

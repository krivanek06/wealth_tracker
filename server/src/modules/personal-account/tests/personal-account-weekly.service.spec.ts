import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { when } from 'jest-when';
import { PrismaService } from '../../../prisma';
import { PersonalAccount } from '../entities';
import { PersonalAccountWeeklyService } from '../services';
import { PersonalAccountMonthlyData } from './../entities/';

describe('PersonalAccountWeeklyService', () => {
	let service: PersonalAccountWeeklyService;

	const PERSONAL_ACCOUNT_ID_EMPTY = { id: 'EMPTY' } as PersonalAccount;
	const PERSONAL_ACCOUNT_MONTHLY_DATA_EMPTY: PersonalAccountMonthlyData = {
		personalAccountId: PERSONAL_ACCOUNT_ID_EMPTY.id,
		id: '634a522ff8c911d565a41f1a',
		month: 9,
		year: 2022,
		dailyData: [],
	};

	const PERSONAL_ACCOUNT_ID_SINGLE_MONTH = { id: 'SINGLE_MONTH' } as PersonalAccount;
	const PERSONAL_ACCOUNT_MONTHLY_DATA_SINGLE_MONTHL: PersonalAccountMonthlyData = {
		personalAccountId: PERSONAL_ACCOUNT_ID_SINGLE_MONTH.id,
		id: '634a522ff8c911d565a41f1a',
		month: 9,
		year: 2022,
		dailyData: [
			{
				id: '94ac4e64-4ac2-4773-bcb6-46d8269bafa0',
				value: 10,
				date: new Date(1665733206000),
				tagId: '634a55e83d5f2180e336af5a',
				monthlyDataId: '634a522ff8c911d565a41f1a',
				week: 42,
				userId: '1234',
			},
			{
				id: '017321af-ae2e-4aac-a536-322d173fb48d',
				value: 10,
				date: new Date(1665733206000),
				tagId: '634a55e83d5f2180e336af5a',
				monthlyDataId: '634a522ff8c911d565a41f1a',
				week: 42,
				userId: '1234',
			},
			{
				id: 'da107f69-382c-4a42-b22f-162691aa0935',
				value: 10,
				date: new Date(1665733206000),
				tagId: '634a55e93d5f2180e336af5c',
				monthlyDataId: '634a522ff8c911d565a41f1a',
				week: 42,
				userId: '1234',
			},
			{
				id: '3f4ffcdc-9d60-4461-85d2-ca411c68b845',
				value: 10,
				date: new Date(1665733206000),
				tagId: '634a55e93d5f2180e336af5c',
				monthlyDataId: '634a522ff8c911d565a41f1a',
				week: 42,
				userId: '1234',
			},
			{
				id: 'cd1a9003-22c3-4643-8b6c-e261ff690bc6',
				value: 10,
				date: new Date(1665733206000),
				tagId: '634a55e93d5f2180e336af5f',
				monthlyDataId: '634a522ff8c911d565a41f1a',
				week: 42,
				userId: '1234',
			},
		],
	};

	const PERSONAL_ACCOUNT_ID_MULTIPLE_MONTHS = { id: 'MULTIPLE_MONTHS' } as PersonalAccount;
	const PERSONAL_ACCOUNT_MONTHLY_DATA_MULTIPLE_MONTHS: PersonalAccountMonthlyData[] = [
		{ ...PERSONAL_ACCOUNT_MONTHLY_DATA_SINGLE_MONTHL, id: PERSONAL_ACCOUNT_ID_MULTIPLE_MONTHS.id },
		{
			personalAccountId: PERSONAL_ACCOUNT_ID_MULTIPLE_MONTHS.id,
			id: '1234213321321321',
			month: 10,
			year: 2022,
			dailyData: [
				{
					id: '94ac4e64-4ac2-4773-bcb6-46d8269bafa0',
					value: 5,
					date: new Date(1665733206000),
					tagId: '634a55e83d5f2180e336af5a',
					monthlyDataId: '634a522ff8c911d565a41f1a',
					week: 46,
					userId: '1234',
				},
				{
					id: '017321af-ae2e-4aac-a536-322d173fb48d',
					value: 5,
					date: new Date(1665733206000),
					tagId: '634a55e83d5f2180e336af5a',
					monthlyDataId: '634a522ff8c911d565a41f1a',
					week: 46,
					userId: '1234',
				},
				{
					id: 'da107f69-382c-4a42-b22f-162691aa0935',
					value: 15,
					date: new Date(1665733206000),
					tagId: '634a55e93d5f2180e336af5c',
					monthlyDataId: '634a522ff8c911d565a41f1a',
					week: 46,
					userId: '1234',
				},
			],
		},
	];
	// mock prisma service
	const prismaServiceMock: PrismaService = createMock<PrismaService>({
		personalAccountMonthlyData: {
			findMany: jest.fn(),
		},
	});
	when(prismaServiceMock.personalAccountMonthlyData.findMany)
		.calledWith({
			where: {
				personalAccountId: PERSONAL_ACCOUNT_ID_SINGLE_MONTH.id,
			},
		})
		.mockResolvedValue([PERSONAL_ACCOUNT_MONTHLY_DATA_SINGLE_MONTHL])
		.calledWith({
			where: {
				personalAccountId: PERSONAL_ACCOUNT_ID_EMPTY.id,
			},
		})
		.mockResolvedValue([PERSONAL_ACCOUNT_MONTHLY_DATA_EMPTY])
		.calledWith({
			where: {
				personalAccountId: PERSONAL_ACCOUNT_ID_MULTIPLE_MONTHS.id,
			},
		})
		.mockResolvedValue(PERSONAL_ACCOUNT_MONTHLY_DATA_MULTIPLE_MONTHS);

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [PersonalAccountWeeklyService, { provide: PrismaService, useValue: prismaServiceMock }],
		}).compile();

		service = module.get<PersonalAccountWeeklyService>(PersonalAccountWeeklyService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('Test: getAllWeeklyAggregatedData()', () => {
		it('should return empty result on empty dailyData', async () => {
			const result = await service.getAllWeeklyAggregatedData(PERSONAL_ACCOUNT_ID_EMPTY);
			expect(result).toEqual([]);
			expect(result).toHaveLength(0);
		});

		it('should return aggregated weekly data for single month', async () => {
			const aggregatedResult = [
				{
					id: '2022-9-42-634a55e83d5f2180e336af5a',
					year: 2022,
					month: 9,
					week: 42,
					value: 20,
					personalAccountTagId: '634a55e83d5f2180e336af5a',
					entries: 2,
				},
				{
					id: '2022-9-42-634a55e93d5f2180e336af5c',
					year: 2022,
					month: 9,
					week: 42,
					value: 20,
					personalAccountTagId: '634a55e93d5f2180e336af5c',
					entries: 2,
				},
				{
					id: '2022-9-42-634a55e93d5f2180e336af5f',
					year: 2022,
					month: 9,
					week: 42,
					value: 10,
					personalAccountTagId: '634a55e93d5f2180e336af5f',
					entries: 1,
				},
			];

			const result = await service.getAllWeeklyAggregatedData(PERSONAL_ACCOUNT_ID_SINGLE_MONTH);

			// test loading monthly data
			expect(prismaServiceMock.personalAccountMonthlyData.findMany).toHaveBeenCalledWith({
				where: {
					personalAccountId: PERSONAL_ACCOUNT_ID_SINGLE_MONTH.id,
				},
			});

			expect(result).toStrictEqual(aggregatedResult);
		});

		it('should return aggregated weekly data for multiple months', async () => {
			const aggregatedResult = [
				{
					id: '2022-9-42-634a55e83d5f2180e336af5a',
					year: 2022,
					month: 9,
					week: 42,
					value: 20,
					personalAccountTagId: '634a55e83d5f2180e336af5a',
					entries: 2,
				},
				{
					id: '2022-9-42-634a55e93d5f2180e336af5c',
					year: 2022,
					month: 9,
					week: 42,
					value: 20,
					personalAccountTagId: '634a55e93d5f2180e336af5c',
					entries: 2,
				},
				{
					id: '2022-9-42-634a55e93d5f2180e336af5f',
					year: 2022,
					month: 9,
					week: 42,
					value: 10,
					personalAccountTagId: '634a55e93d5f2180e336af5f',
					entries: 1,
				},
				{
					id: '2022-10-46-634a55e83d5f2180e336af5a',
					year: 2022,
					month: 10,
					week: 46,
					value: 10,
					personalAccountTagId: '634a55e83d5f2180e336af5a',
					entries: 2,
				},
				{
					id: '2022-10-46-634a55e93d5f2180e336af5c',
					year: 2022,
					month: 10,
					week: 46,
					value: 15,
					personalAccountTagId: '634a55e93d5f2180e336af5c',
					entries: 1,
				},
			];

			const result = await service.getAllWeeklyAggregatedData(PERSONAL_ACCOUNT_ID_MULTIPLE_MONTHS);

			// test loading monthly data
			expect(prismaServiceMock.personalAccountMonthlyData.findMany).toHaveBeenCalledWith({
				where: {
					personalAccountId: PERSONAL_ACCOUNT_ID_MULTIPLE_MONTHS.id,
				},
			});

			expect(result).toStrictEqual(aggregatedResult);
		});
	});
});

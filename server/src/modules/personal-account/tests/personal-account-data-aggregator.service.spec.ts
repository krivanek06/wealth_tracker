import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { when } from 'jest-when';
import { PrismaService } from '../../../prisma';
import { PersonalAccount, PersonalAccountMonthlyData, PersonalAccountTag } from '../entities';
import { PersonalAccountAggregationDataOutput, PersonalAccountWeeklyAggregationOutput } from '../outputs';
import { PersonalAccounDataAggregatorService, PersonalAccountTagService } from '../services';

describe('PersonalAccounDataAggregatorService', () => {
	let service: PersonalAccounDataAggregatorService;
	const USER_ID_MOCK = 'TEST_USER_1234';

	const PERSONAL_ACCOUNT_ID_EMPTY = { id: 'EMPTY' } as PersonalAccount;
	const PERSONAL_ACCOUNT_MONTHLY_DATA_EMPTY: PersonalAccountMonthlyData = {
		personalAccountId: PERSONAL_ACCOUNT_ID_EMPTY.id,
		id: '634a522ff8c911d565a41f1a',
		month: 9,
		year: 2022,
		dailyData: [],
		userId: USER_ID_MOCK,
	};

	const PERSONAL_ACCOUNT_ID_MULTIPLE_MONTHS = { id: 'MULTIPLE_MONTHS' } as PersonalAccount;
	const PERSONAL_ACCOUNT_MONTHLY_DATA_MULTIPLE_MONTHS: PersonalAccountMonthlyData[] = [
		{
			id: PERSONAL_ACCOUNT_ID_MULTIPLE_MONTHS.id,
			month: 9,
			year: 2022,
			personalAccountId: PERSONAL_ACCOUNT_ID_EMPTY.id,
			userId: USER_ID_MOCK,
			dailyData: [
				{
					id: '94ac4e64-4ac2-4773-bcb6-46d8269bafa0',
					value: 10,
					date: new Date('1665733206000'),
					tagId: '634a55e83d5f2180e336af5a',
					monthlyDataId: '634a522ff8c911d565a41f1a',
					week: 42,
					userId: '1234',
				},
				{
					id: '017321af-ae2e-4aac-a536-322d173fb48d',
					value: 10,
					date: new Date('1665733206000'),
					tagId: '634a55e83d5f2180e336af5a',
					monthlyDataId: '634a522ff8c911d565a41f1a',
					week: 42,
					userId: '1234',
				},
				{
					id: 'da107f69-382c-4a42-b22f-162691aa0935',
					value: 10,
					date: new Date('1665733206000'),
					tagId: '634a55e93d5f2180e336af5c',
					monthlyDataId: '634a522ff8c911d565a41f1a',
					week: 42,
					userId: '1234',
				},
				{
					id: '3f4ffcdc-9d60-4461-85d2-ca411c68b845',
					value: 10,
					date: new Date('1665733206000'),
					tagId: '634a55e93d5f2180e336af5c',
					monthlyDataId: '634a522ff8c911d565a41f1a',
					week: 42,
					userId: '1234',
				},
				{
					id: 'cd1a9003-22c3-4643-8b6c-e261ff690bc6',
					value: 10,
					date: new Date('1665733206000'),
					tagId: '634a55e93d5f2180e336af5f',
					monthlyDataId: '634a522ff8c911d565a41f1a',
					week: 42,
					userId: '1234',
				},
			],
		},
		{
			id: '63522c180990090d666127db',
			month: 8,
			year: 2022,
			personalAccountId: PERSONAL_ACCOUNT_ID_EMPTY.id,
			userId: USER_ID_MOCK,
			dailyData: [
				{
					id: '25975432-1f08-45d7-aa33-1d1c065ff783',
					value: 14,
					date: new Date('1662757200000'),
					tagId: '634a55ea3d5f2180e336af60',
					monthlyDataId: '63522c180990090d666127db',
					week: 37,
					userId: '1234',
				},
				{
					id: '6d73bd80-6120-4ba9-bfce-923b5bbe554a',
					value: 14,
					date: new Date('1663016400000'),
					tagId: '634a55ea3d5f2180e336af60',
					monthlyDataId: '63522c180990090d666127db',
					week: 38,
					userId: '1234',
				},
				{
					id: '2028a86a-132c-4a1b-932d-6fd6084c31d1',
					value: 12,
					date: new Date('1663016400000'),
					tagId: '634a55ea3d5f2180e336af61',
					monthlyDataId: '63522c180990090d666127db',
					week: 38,
					userId: '1234',
				},
				{
					id: 'e54bfa8a-f38b-4d90-83f5-004003ee6187',
					value: 12,
					date: new Date('1663016400000'),
					tagId: '634a55e83d5f2180e336af5a',
					monthlyDataId: '63522c180990090d666127db',
					week: 38,
					userId: '1234',
				},
				{
					id: 'eee8d135-e213-42b4-a9f8-1108775fde59',
					value: 11,
					date: new Date('1663016400000'),
					tagId: '634a55e83d5f2180e336af5a',
					monthlyDataId: '63522c180990090d666127db',
					week: 38,
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
	const mockTag: PersonalAccountTag = {
		name: 'Test tag',
		type: 'EXPENSE',
	} as PersonalAccountTag;
	const personalAccountTagServiceMock: PersonalAccountTagService = createMock<PersonalAccountTagService>({
		getDefaultTagById: jest.fn().mockReturnValue(mockTag),
	});

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				PersonalAccounDataAggregatorService,
				{ provide: PrismaService, useValue: prismaServiceMock },
				{ provide: PersonalAccountTagService, useValue: personalAccountTagServiceMock },
			],
		}).compile();

		service = module.get<PersonalAccounDataAggregatorService>(PersonalAccounDataAggregatorService);

		when(prismaServiceMock.personalAccountMonthlyData.findMany)
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
	});

	afterEach(() => {
		jest.clearAllMocks();
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

		it('should return aggregated weekly data for multiple months', async () => {
			const aggregatedResult: PersonalAccountWeeklyAggregationOutput[] = [
				{
					id: '2022-9-42',
					year: 2022,
					month: 9,
					week: 42,
					data: [
						{
							value: 20,
							entries: 2,
							tagId: '634a55e83d5f2180e336af5a',
							tagName: mockTag.name,
							tagType: mockTag.type,
						},
						{
							value: 20,
							entries: 2,
							tagId: '634a55e93d5f2180e336af5c',
							tagName: mockTag.name,
							tagType: mockTag.type,
						},
						{
							value: 10,
							entries: 1,
							tagId: '634a55e93d5f2180e336af5f',
							tagName: mockTag.name,
							tagType: mockTag.type,
						},
					],
				},
				{
					id: '2022-8-37',
					year: 2022,
					month: 8,
					week: 37,
					data: [
						{
							value: 14,
							entries: 1,
							tagId: '634a55ea3d5f2180e336af60',
							tagName: mockTag.name,
							tagType: mockTag.type,
						},
					],
				},
				{
					id: '2022-8-38',
					year: 2022,
					month: 8,
					week: 38,
					data: [
						{
							value: 14,
							entries: 1,
							tagId: '634a55ea3d5f2180e336af60',
							tagName: mockTag.name,
							tagType: mockTag.type,
						},
						{
							value: 12,
							entries: 1,
							tagId: '634a55ea3d5f2180e336af61',
							tagName: mockTag.name,
							tagType: mockTag.type,
						},
						{
							value: 23,
							entries: 2,
							tagId: '634a55e83d5f2180e336af5a',
							tagName: mockTag.name,
							tagType: mockTag.type,
						},
					],
				},
			] as PersonalAccountWeeklyAggregationOutput[];

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

	describe('Test: getAllYearlyAggregatedData()', () => {
		it('should return yearly weekly data for multiple months', async () => {
			const expectedResult: PersonalAccountAggregationDataOutput[] = [
				{
					value: 43,
					entries: 4,
					tagId: '634a55e83d5f2180e336af5a',
					tagName: mockTag.name,
					tagType: mockTag.type,
					tagColor: mockTag.color,
				},
				{
					value: 20,
					entries: 2,
					tagId: '634a55e93d5f2180e336af5c',
					tagName: mockTag.name,
					tagType: mockTag.type,
					tagColor: mockTag.color,
				},
				{
					value: 10,
					entries: 1,
					tagId: '634a55e93d5f2180e336af5f',
					tagName: mockTag.name,
					tagType: mockTag.type,
					tagColor: mockTag.color,
				},
				{
					value: 28,
					entries: 2,
					tagId: '634a55ea3d5f2180e336af60',
					tagName: mockTag.name,
					tagType: mockTag.type,
					tagColor: mockTag.color,
				},
				{
					value: 12,
					entries: 1,
					tagId: '634a55ea3d5f2180e336af61',
					tagName: mockTag.name,
					tagType: mockTag.type,
					tagColor: mockTag.color,
				},
			];

			const result = await service.getAllYearlyAggregatedData(PERSONAL_ACCOUNT_ID_MULTIPLE_MONTHS);

			expect(result).toStrictEqual(expectedResult);
		});
	});
});

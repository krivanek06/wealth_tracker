import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { when } from 'jest-when';
import { PrismaService } from '../../../prisma';
import { INVESTMENT_ACCOUNT_ERROR, INVESTMENT_ACCOUNT_MAX } from '../dto';
import { InvestmentAccount } from '../entities';
import { InvestmentAccountCreateInput, InvestmentAccountEditInput } from '../inputs';
import { InvestmentAccountService } from '../services';
import { AssetGeneralService } from './../../asset-manager';

describe('InvestmentAccountService', () => {
	let service: InvestmentAccountService;
	const mockUserId = 'USER1';
	const mockUserId2 = '1234gfdas';
	const mockInvestmentAccountId = '12344321';

	const investmentAccountMock: InvestmentAccount = {
		name: 'TEST_1234',
		userId: mockUserId,
		holdings: [],
		cashChange: [],
		createdAt: new Date('2022-03-05'),
		id: mockInvestmentAccountId,
	};

	const prismaServiceMock: PrismaService = createMock<PrismaService>({
		investmentAccount: {
			findMany: jest.fn(),
			create: jest.fn().mockResolvedValue(investmentAccountMock),
			findFirst: jest.fn(),
			count: jest.fn(),
			update: jest.fn(),
			delete: jest.fn(),
		},
	});

	const assetGeneralServiceMock = createMock<AssetGeneralService>();

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				InvestmentAccountService,
				{ provide: PrismaService, useValue: prismaServiceMock },
				{ provide: AssetGeneralService, useValue: assetGeneralServiceMock },
			],
		}).compile();

		service = module.get<InvestmentAccountService>(InvestmentAccountService);

		when(prismaServiceMock.investmentAccount.count)
			.calledWith({
				where: {
					userId: mockUserId,
				},
			})
			.mockResolvedValue(INVESTMENT_ACCOUNT_MAX - 1)
			.calledWith({
				where: {
					userId: mockUserId2,
				},
			})
			.mockResolvedValue(INVESTMENT_ACCOUNT_MAX);

		when(prismaServiceMock.investmentAccount.count)
			.calledWith({
				where: {
					id: mockInvestmentAccountId,
					userId: mockUserId,
				},
			})
			.mockResolvedValue(1)
			.calledWith({
				where: {
					id: mockInvestmentAccountId,
					userId: mockUserId2,
				},
			})
			.mockResolvedValue(0);

		when(prismaServiceMock.investmentAccount.findMany)
			.calledWith({
				where: {
					userId: mockUserId,
				},
			})
			.mockResolvedValue([investmentAccountMock]);

		when(prismaServiceMock.investmentAccount.findFirst)
			.calledWith({
				where: {
					id: mockInvestmentAccountId,
					userId: mockUserId,
				},
			})
			.mockResolvedValue(investmentAccountMock);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('Test: getInvestmentAccounts()', () => {
		it('should return array of investment accounts', async () => {
			const result = await service.getInvestmentAccounts(mockUserId);
			expect(prismaServiceMock.investmentAccount.findMany).toHaveBeenCalledWith({
				where: {
					userId: mockUserId,
				},
			});
			expect(result).toHaveLength(1);
			expect(result).toStrictEqual([investmentAccountMock]);
		});
	});

	describe('Test: getInvestmentAccountById()', () => {
		it('should return an invest account', async () => {
			const result = await service.getInvestmentAccountById(mockInvestmentAccountId, mockUserId);
			expect(prismaServiceMock.investmentAccount.findFirst);
			expect(result).toStrictEqual(investmentAccountMock);
		});

		it('should thrown an error if not found', async () => {
			await expect(service.getInvestmentAccountById(mockInvestmentAccountId, 'mockUserId')).rejects.toThrowError(
				INVESTMENT_ACCOUNT_ERROR.NOT_FOUND
			);
		});
	});

	describe('Test: createInvestmentAccount()', () => {
		const input: InvestmentAccountCreateInput = { name: 'TEST_1234' };

		it('should create an investment account', async () => {
			const result = await service.createInvestmentAccount(input, mockUserId);

			// test load
			expect(prismaServiceMock.investmentAccount.count).toHaveBeenCalledWith({
				where: {
					userId: mockUserId,
				},
			});

			// test save
			const databaseData = {
				name: input.name,
				userId: mockUserId,
				holdings: [],
				cashChange: [],
			};
			expect(prismaServiceMock.investmentAccount.create).toHaveBeenCalledWith({ data: databaseData });
			expect(result).toStrictEqual(investmentAccountMock);
		});

		it(`should throw an error if more than ${INVESTMENT_ACCOUNT_MAX} accounts is created`, async () => {
			await expect(service.createInvestmentAccount(input, mockUserId2)).rejects.toThrowError(
				INVESTMENT_ACCOUNT_ERROR.NOT_ALLOWED_TO_CTEATE
			);
		});
	});

	describe('Test: editInvestmentAccount()', () => {
		const input: InvestmentAccountEditInput = {
			investmentAccountId: mockInvestmentAccountId,
			name: 'Test 1234',
		};
		const expectedEditResult: InvestmentAccount = {
			name: input.name,
			userId: mockUserId,
			holdings: [],
			cashChange: [],
			createdAt: new Date('2022-04-04'),
			id: mockInvestmentAccountId,
		};

		when(prismaServiceMock.investmentAccount.update).mockResolvedValue({
			...expectedEditResult,
		});

		it('should edit an existing investment account', async () => {
			const result = await service.editInvestmentAccount(input, mockUserId);

			// check if updated in prisma
			expect(prismaServiceMock.investmentAccount.update).toHaveBeenCalledWith({
				data: {
					name: input.name,
				},
				where: {
					id: input.investmentAccountId,
				},
			});

			// check prisma result
			expect(result).toStrictEqual(expectedEditResult);
		});

		it('should throw an error if investment account doesnt ', async () => {
			await expect(service.editInvestmentAccount(input, mockUserId2)).rejects.toThrowError(
				INVESTMENT_ACCOUNT_ERROR.NOT_FOUND
			);
		});
	});

	describe('Test: deleteInvestmentAccount()', () => {
		it('should delete an investment account', async () => {
			when(prismaServiceMock.investmentAccount.count).mockResolvedValue(1);
			when(prismaServiceMock.investmentAccount.delete).mockResolvedValue(investmentAccountMock);

			const result = await service.deleteInvestmentAccount(investmentAccountMock.id, mockUserId);
			expect(result).toStrictEqual(investmentAccountMock);
		});

		it('should thrown an error if investment account does not exist', async () => {
			when(prismaServiceMock.investmentAccount.count).mockResolvedValue(0);
			await expect(service.deleteInvestmentAccount(investmentAccountMock.id, mockUserId2)).rejects.toThrowError(
				INVESTMENT_ACCOUNT_ERROR.NOT_FOUND
			);
		});
	});
});

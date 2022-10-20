import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { when } from 'jest-when';
import { PrismaService } from '../../../prisma';
import { InvestmentAccount, InvestmentAccountHistory } from '../entities';
import { InvestmentAccountHistoryService } from '../services/investment-account-history.service';

describe('InvestmentAccountHistoryService', () => {
	let service: InvestmentAccountHistoryService;

	const investmentAccountHistoryIdMock = '1234';
	const investmentAccountIdMock = 'poiuewewew';

	const investmentAccountMock: InvestmentAccount = {
		id: investmentAccountIdMock,
	} as InvestmentAccount;

	const investmentAccountHistoryMock: InvestmentAccountHistory = {
		id: investmentAccountHistoryIdMock,
		investmentAccountId: investmentAccountIdMock,
		portfolioSnapshots: [],
		portfolioSnapshotTotal: 0,
	};

	const prismaServiceMock: PrismaService = createMock<PrismaService>({
		investmentAccountHistory: {
			findFirst: jest.fn(),
			create: jest.fn().mockResolvedValue(investmentAccountHistoryMock),
		},
	});

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [InvestmentAccountHistoryService, { provide: PrismaService, useValue: prismaServiceMock }],
		}).compile();

		service = module.get<InvestmentAccountHistoryService>(InvestmentAccountHistoryService);

		when(prismaServiceMock.investmentAccountHistory.findFirst)
			.calledWith({
				where: {
					investmentAccountId: investmentAccountIdMock,
				},
			})
			.mockResolvedValue(investmentAccountHistoryMock);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('Test: getInvestmentAccountHistoryInvestmentAccount()', () => {
		it('should return investmentAccountHistory by investmentAccountId', async () => {
			const result = await service.getInvestmentAccountHistoryInvestmentAccount(investmentAccountMock);

			expect(result).toStrictEqual(investmentAccountHistoryMock);
			expect(prismaServiceMock.investmentAccountHistory.findFirst).toHaveBeenCalledWith({
				where: {
					investmentAccountId: investmentAccountIdMock,
				},
			});
		});
	});

	describe('Test: createInvestmentAccountHistory()', () => {
		it('should create an investmentAccountHistory', async () => {
			const result = await service.createInvestmentAccountHistory(investmentAccountMock);

			expect(result).toStrictEqual(investmentAccountHistoryMock);
			expect(prismaServiceMock.investmentAccountHistory.create).toHaveBeenCalledWith({
				data: {
					investmentAccountId: investmentAccountMock.id,
					portfolioSnapshotTotal: 0,
					portfolioSnapshots: [],
				},
			});
		});
	});
});

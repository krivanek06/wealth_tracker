import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { when } from 'jest-when';
import { PrismaService } from '../../../prisma';
import { SharedServiceUtil } from '../../../utils';
import { INVESTMENT_ACCOUNT_CASH_CHANGE_ERROR, INVESTMENT_ACCOUNT_ERROR } from '../dto';
import { InvestmentAccount, InvestmentAccountCashChange } from '../entities';
import {
	InvestmentAccountCashCreateInput,
	InvestmentAccountCashDeleteInput,
	InvestmentAccountCashEditInput,
} from '../inputs';
import { InvestmentAccountCashChangeService } from '../services';

describe('InvestmentAccountCashChangeService', () => {
	const mockUserId = 'USER1';
	const mockInvestmentAccountId = '12344321';
	// const mockInvestmentAccountIdNotFound = 'NOT_FOUND';

	SharedServiceUtil.getUUID = jest.fn().mockReturnValue(111);

	const cashChangeExistingMock: InvestmentAccountCashChange = {
		itemId: '3333',
		date: '2022-03-21',
		cashCurrent: 32222,
	};
	const investmentAccountMock: InvestmentAccount = {
		name: 'TEST_1234',
		userId: mockUserId,
		holdings: [],
		cashChange: [cashChangeExistingMock],
		createdAt: new Date('2022-03-05'),
		id: mockInvestmentAccountId,
	};

	let service: InvestmentAccountCashChangeService;

	const prismaServiceMock: PrismaService = createMock<PrismaService>({
		investmentAccount: {
			update: jest.fn(),
			findFirst: jest.fn(),
		},
	});

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [InvestmentAccountCashChangeService, { provide: PrismaService, useValue: prismaServiceMock }],
		}).compile();

		service = module.get<InvestmentAccountCashChangeService>(InvestmentAccountCashChangeService);

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

	describe('Test: createInvestmentAccountCashe()', () => {
		let input: InvestmentAccountCashCreateInput;

		beforeEach(() => {
			input = {
				investmentAccountId: mockInvestmentAccountId,
				cashCurrent: 10000,
				date: '2022-05-12',
			};
		});

		it('should create cash change', async () => {
			const expectedResponse: InvestmentAccountCashChange = {
				itemId: SharedServiceUtil.getUUID(),
				cashCurrent: input.cashCurrent,
				date: input.date,
			};

			const result = await service.createInvestmentAccountCashe(input, mockUserId);

			expect(result).toStrictEqual(expectedResponse);
			expect(prismaServiceMock.investmentAccount.update).toHaveBeenCalledWith({
				data: {
					cashChange: {
						set: [cashChangeExistingMock, expectedResponse],
					},
				},
				where: {
					id: mockInvestmentAccountId,
				},
			});
		});

		it('should thrown an error if investment account not found', async () => {
			await expect(service.createInvestmentAccountCashe(input, 'NOT_EXISTING')).rejects.toThrowError(
				INVESTMENT_ACCOUNT_ERROR.NOT_FOUND
			);
		});
	});

	describe('Test: editInvestmentAccountCashe()', () => {
		it('should edit cash change', async () => {
			const input: InvestmentAccountCashEditInput = {
				itemId: cashChangeExistingMock.itemId,
				cashCurrent: 111,
				date: '2021-04-21',
				investmentAccountId: mockInvestmentAccountId,
			};

			const expectedResponse: InvestmentAccountCashChange = {
				itemId: input.itemId,
				cashCurrent: input.cashCurrent,
				date: input.date,
			};

			const result = await service.editInvestmentAccountCashe(input, mockUserId);

			expect(result).toStrictEqual(expectedResponse);
			expect(prismaServiceMock.investmentAccount.update).toHaveBeenCalledWith({
				data: {
					cashChange: {
						set: [expectedResponse],
					},
				},
				where: {
					id: mockInvestmentAccountId,
				},
			});
		});

		it('should thrown an error if cash change not found', async () => {
			const input: InvestmentAccountCashEditInput = {
				itemId: 'NOT_FOUND',
				cashCurrent: 111,
				date: '2021-04-21',
				investmentAccountId: mockInvestmentAccountId,
			};

			await expect(service.editInvestmentAccountCashe(input, mockUserId)).rejects.toThrowError(
				INVESTMENT_ACCOUNT_CASH_CHANGE_ERROR.NOT_FOUND
			);
		});
	});

	describe('Test: deleteInvestmentAccountCashe()', () => {
		it('should delete cash change', async () => {
			const input: InvestmentAccountCashDeleteInput = {
				itemId: cashChangeExistingMock.itemId,
				investmentAccountId: mockInvestmentAccountId,
			};

			const result = await service.deleteInvestmentAccountCashe(input, mockUserId);

			expect(result).toStrictEqual(cashChangeExistingMock);
			expect(prismaServiceMock.investmentAccount.update).toHaveBeenCalledWith({
				data: {
					cashChange: {
						set: [],
					},
				},
				where: {
					id: mockInvestmentAccountId,
				},
			});
		});

		it('should thrown an error if cash change not found', async () => {
			const input: InvestmentAccountCashDeleteInput = {
				itemId: 'NOT_FOUND',
				investmentAccountId: mockInvestmentAccountId,
			};

			await expect(service.deleteInvestmentAccountCashe(input, mockUserId)).rejects.toThrowError(
				INVESTMENT_ACCOUNT_CASH_CHANGE_ERROR.NOT_FOUND
			);
		});
	});
});

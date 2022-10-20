import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { when } from 'jest-when';
import { PrismaService } from '../../../prisma';
import { INVESTMENT_ACCOUNT_HOLDING_ERROR, INVESTMENT_ACOUNT_HOLDING_LIMIT } from '../dto';
import { InvestmentAccountHolding } from '../entities';
import {
	InvestmentAccounHoldingCreateInput,
	InvestmentAccounHoldingDeleteInput,
	InvestmentAccounHoldingEditInput,
} from '../inputs';
import { InvestmentAccountHoldingService, InvestmentAccountService } from '../services';
import { holdingMSFTMock, investmentAccountMock as IAM } from './mocks';

describe('InvestmentAccountHoldingService', () => {
	let service: InvestmentAccountHoldingService;

	const investmentAccountMock = IAM;

	const prismaServiceMock: PrismaService = createMock<PrismaService>({
		investmentAccount: {
			update: jest.fn(),
		},
	});
	const investmentAccountServiceMock: InvestmentAccountService = createMock<InvestmentAccountService>({
		getInvestmentAccountById: jest.fn(),
	});

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				InvestmentAccountHoldingService,
				{ provide: PrismaService, useValue: prismaServiceMock },
				{ provide: InvestmentAccountService, useValue: investmentAccountServiceMock },
			],
		}).compile();

		service = module.get<InvestmentAccountHoldingService>(InvestmentAccountHoldingService);

		when(investmentAccountServiceMock.getInvestmentAccountById).mockResolvedValue(investmentAccountMock);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('Test: createInvestmentAccountHolding()', () => {
		it('should create an investment account holding', async () => {
			// input
			const input: InvestmentAccounHoldingCreateInput = {
				investedAlready: 120,
				investmentAccountId: investmentAccountMock.id,
				symbol: 'TEST_SYMBOL',
				type: 'STOCK',
				units: 10,
			};

			// expected response
			const expectedResponse: InvestmentAccountHolding = {
				id: input.symbol,
				investedAlready: input.investedAlready,
				investmentAccountId: input.investmentAccountId,
				type: input.type,
				units: input.units,
			};

			const result = await service.createInvestmentAccountHolding(input, '1234');

			// check saving holding into DB
			expect(prismaServiceMock.investmentAccount.update).toHaveBeenCalledWith({
				data: {
					holdings: [...investmentAccountMock.holdings, expectedResponse],
				},
				where: {
					id: expectedResponse.investmentAccountId,
				},
			});

			// check response
			expect(result).toStrictEqual(expectedResponse);
		});

		it('should thrown an error if holding has reached its limit', async () => {
			// creating a response that has the holding field the maximum size that is available
			const limitArray = Array.from(Array(INVESTMENT_ACOUNT_HOLDING_LIMIT).keys()).map(() => holdingMSFTMock);
			when(investmentAccountServiceMock.getInvestmentAccountById).mockResolvedValue({
				...investmentAccountMock,
				holdings: limitArray,
			});

			await expect(
				service.createInvestmentAccountHolding({} as InvestmentAccounHoldingCreateInput, 'mockUserId2')
			).rejects.toThrowError(INVESTMENT_ACCOUNT_HOLDING_ERROR.MAXIMUM_REACHED);
		});

		it('should thrown an error if I want to add the same symbol twice', async () => {
			// create input of a symbol that is already in investmentAccountMock
			const input: InvestmentAccounHoldingCreateInput = {
				symbol: investmentAccountMock.holdings[0].id,
			} as InvestmentAccounHoldingCreateInput;

			await expect(service.createInvestmentAccountHolding(input, 'mockUserId2')).rejects.toThrowError(
				INVESTMENT_ACCOUNT_HOLDING_ERROR.ALREADY_CONTAIN
			);
		});
	});

	describe('Test: editInvestmentAccountHolding()', () => {
		it('should edit an existing symbol in my holdings', async () => {
			// input
			const input: InvestmentAccounHoldingEditInput = {
				investedAlready: 9999,
				investmentAccountId: holdingMSFTMock.investmentAccountId,
				symbol: holdingMSFTMock.id,
				units: 44,
			};
			// expected result
			const expectedResult: InvestmentAccountHolding = {
				...holdingMSFTMock,
				investedAlready: input.investedAlready,
				units: input.units,
			};

			const newHoldings = investmentAccountMock.holdings.map((x) => (x.id === input.symbol ? expectedResult : x));
			const result = await service.editInvestmentAccountHolding(input, 'random');

			// check DB update
			expect(prismaServiceMock.investmentAccount.update).toHaveBeenCalledWith({
				data: {
					holdings: newHoldings,
				},
				where: {
					id: input.investmentAccountId,
				},
			});
			// check result from mutation
			expect(result).toStrictEqual(expectedResult);
		});

		it('should throw an error if symbol does not exist in my holdings', async () => {
			const input: InvestmentAccounHoldingEditInput = {
				symbol: 'SYMBOL_NOT_EXISTS',
			} as InvestmentAccounHoldingEditInput;

			await expect(service.editInvestmentAccountHolding(input, 'mockUserId2')).rejects.toThrowError(
				INVESTMENT_ACCOUNT_HOLDING_ERROR.NOT_FOUND
			);
		});
	});

	describe('Test: deleteInvestmentAccountHolding()', () => {
		it('should delete a symbol from my holdings', async () => {
			const input: InvestmentAccounHoldingDeleteInput = {
				investmentAccountId: holdingMSFTMock.investmentAccountId,
				symbol: holdingMSFTMock.id,
			};

			const result = await service.deleteInvestmentAccountHolding(input, 'random');
			const newHoldings = investmentAccountMock.holdings.filter((x) => x.id !== input.symbol);

			// check DB update
			expect(prismaServiceMock.investmentAccount.update).toHaveBeenCalledWith({
				data: {
					holdings: newHoldings,
				},
				where: {
					id: input.investmentAccountId,
				},
			});
			// check result from mutation
			expect(result).toStrictEqual(holdingMSFTMock);
		});

		it('should throw an error if symbol does not exist in my holdings', async () => {
			const input: InvestmentAccounHoldingDeleteInput = {
				symbol: 'SYMBOL_NOT_EXISTS',
			} as InvestmentAccounHoldingDeleteInput;

			await expect(service.deleteInvestmentAccountHolding(input, 'mockUserId2')).rejects.toThrowError(
				INVESTMENT_ACCOUNT_HOLDING_ERROR.NOT_FOUND
			);
		});
	});
});

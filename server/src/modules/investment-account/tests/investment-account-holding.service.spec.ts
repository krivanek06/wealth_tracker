import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { when } from 'jest-when';
import { PrismaService } from '../../../prisma';
import { MomentServiceUtil, SharedServiceUtil } from '../../../utils';
import { AssetStock, AssetStockService } from '../../asset-manager';
import { INVESTMENT_ACCOUNT_HOLDING_ERROR, INVESTMENT_ACCOUNT_HOLDING_MAX_YEARS } from '../dto';
import { InvestmentAccount, InvestmentAccountHolding, InvestmentAccountHoldingHistory } from '../entities';
import {
	HoldingInputData,
	InvestmentAccounHoldingCreateInput,
	InvestmentAccounHoldingHistoryDeleteInput,
} from '../inputs';
import { InvestmentAccountHoldingService, InvestmentAccountService } from '../services';

describe('InvestmentAccountHoldingService', () => {
	let service: InvestmentAccountHoldingService;

	const mockUserId = 'USER1';
	const mockInvestmentAccountId1 = 'mockInvestmentAccountId1';
	const mockInvestmentAccountId2 = 'mockInvestmentAccountId2';
	const symbolMock = 'SYMBOL1';
	const symbolMock2 = 'SYMBOL2';
	const symbolSectorMock = 'SECTOR_MOCK';

	SharedServiceUtil.getUUID = jest.fn().mockReturnValue(1);

	// mock objects
	const mockHistory: InvestmentAccountHoldingHistory = {
		itemId: 'holdings_itemId',
		date: '2022-06-06',
		units: 10,
		investedAmount: 54,
	};
	const mockInput: InvestmentAccounHoldingCreateInput = {
		symbol: symbolMock,
		type: 'STOCK',
		investmentAccountId: mockInvestmentAccountId1,
		holdingInputData: {
			units: 12,
			investedAmount: 3000,
			date: '2022-11-07',
		},
	};
	const mockHoldings: InvestmentAccountHolding[] = [
		{
			assetId: symbolMock,
			sector: symbolSectorMock,
			id: symbolMock,
			type: mockInput.type,
			investmentAccountId: mockInvestmentAccountId2,
			holdingHistory: [mockHistory, { ...mockHistory, itemId: 'holdings_itemId2' }],
		},
		{
			assetId: symbolMock2,
			sector: symbolSectorMock,
			id: symbolMock2,
			type: mockInput.type,
			investmentAccountId: mockInvestmentAccountId2,
			holdingHistory: [mockHistory, { ...mockHistory, itemId: 'holdings_itemId2' }],
		},
	];
	const investmentAccountMock1: InvestmentAccount = {
		id: mockInvestmentAccountId1,
		name: 'TEST1',
		userId: mockUserId,
		createdAt: new Date(),
		cashChange: [],
		holdings: [],
	} as InvestmentAccount;
	const investmentAccountMock2: InvestmentAccount = {
		id: mockInvestmentAccountId2,
		name: 'TEST1',
		userId: mockUserId,
		createdAt: new Date(),
		cashChange: [],
		holdings: mockHoldings,
	} as InvestmentAccount;

	const assetStockMock: AssetStock = { id: symbolMock, profile: { sector: symbolSectorMock } } as AssetStock;

	// mock services
	const prismaServiceMock: PrismaService = createMock<PrismaService>({
		investmentAccount: {
			update: jest.fn(),
		},
	});
	const investmentAccountServiceMock: InvestmentAccountService = createMock<InvestmentAccountService>({
		getInvestmentAccountById: jest.fn(),
	});
	const assetStockServiceMock: AssetStockService = createMock<AssetStockService>({
		refreshStockIntoDatabase: jest.fn().mockResolvedValue(assetStockMock),
	});

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				InvestmentAccountHoldingService,
				{ provide: PrismaService, useValue: prismaServiceMock },
				{ provide: InvestmentAccountService, useValue: investmentAccountServiceMock },
				{ provide: AssetStockService, useValue: assetStockServiceMock },
			],
		}).compile();

		service = module.get<InvestmentAccountHoldingService>(InvestmentAccountHoldingService);

		// mock response
		when(investmentAccountServiceMock.getInvestmentAccountById)
			.calledWith(mockInvestmentAccountId1, mockUserId)
			.mockResolvedValue(investmentAccountMock1)
			.calledWith(mockInvestmentAccountId2, mockUserId)
			.mockResolvedValue(investmentAccountMock2);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('Test: modifyInvestmentAccountHolding()', () => {
		it('should create an investment account holding', async () => {
			const holdingInput: HoldingInputData = {
				units: 111,
				investedAmount: 999,
				date: '2022-10-06',
			};
			const input: InvestmentAccounHoldingCreateInput = {
				symbol: 'NOT_EXISTING',
				holdingInputData: holdingInput,
				investmentAccountId: investmentAccountMock1.id,
				type: 'STOCK',
			};
			const expectedResult: InvestmentAccountHolding = {
				id: input.symbol,
				investmentAccountId: input.investmentAccountId,
				assetId: input.symbol,
				type: input.type,
				sector: symbolSectorMock,
				holdingHistory: [
					{
						date: holdingInput.date,
						investedAmount: holdingInput.investedAmount,
						units: holdingInput.units,
						itemId: SharedServiceUtil.getUUID(),
					},
				],
			};

			const result = await service.modifyInvestmentAccountHolding(input, investmentAccountMock1.userId);

			expect(result).toStrictEqual(expectedResult);
			expect(prismaServiceMock.investmentAccount.update).toHaveBeenCalledWith({
				data: {
					holdings: [expectedResult],
				},
				where: {
					id: expectedResult.investmentAccountId,
				},
			});
		});

		it('should modify an existing holding history', async () => {
			const holding = mockHoldings[0];

			const holdingInput: HoldingInputData = {
				units: 111,
				investedAmount: 999,
				date: '2022-10-06',
			};
			const input: InvestmentAccounHoldingCreateInput = {
				symbol: holding.assetId,
				holdingInputData: holdingInput,
				investmentAccountId: holding.investmentAccountId,
				type: holding.type,
			};

			const expectedResult: InvestmentAccountHolding = {
				...holding,
				holdingHistory: [
					...holding.holdingHistory,
					{
						date: holdingInput.date,
						investedAmount: holdingInput.investedAmount,
						units: holdingInput.units,
						itemId: SharedServiceUtil.getUUID(),
					},
				],
			};
			const expectedResultDbUpdate: InvestmentAccountHolding[] = [{ ...expectedResult }, { ...mockHoldings[1] }];

			const result = await service.modifyInvestmentAccountHolding(input, investmentAccountMock1.userId);

			expect(result).toStrictEqual(expectedResult);
			expect(prismaServiceMock.investmentAccount.update).toHaveBeenCalledWith({
				data: {
					holdings: expectedResultDbUpdate,
				},
				where: {
					id: holding.investmentAccountId,
				},
			});
		});

		it('should call assetStockService.refreshStockIntoDatabase when input.type is STOCK', async () => {
			await service.modifyInvestmentAccountHolding(mockInput, mockUserId);
			await service.modifyInvestmentAccountHolding({ ...mockInput, type: 'CRYPTO' }, mockUserId);

			expect(assetStockServiceMock.refreshStockIntoDatabase).toHaveBeenCalledWith(mockInput.symbol);
			expect(assetStockServiceMock.refreshStockIntoDatabase).toHaveBeenCalledTimes(1);
		});

		it('should thrown an error if passing negative holdingInputData.units', async () => {
			const input: InvestmentAccounHoldingCreateInput = {
				holdingInputData: {
					units: -1,
				},
			} as InvestmentAccounHoldingCreateInput;
			await expect(service.modifyInvestmentAccountHolding(input, mockUserId)).rejects.toThrowError(
				INVESTMENT_ACCOUNT_HOLDING_ERROR.MIN_UNIT_VALUE
			);
		});

		it('should thrown an error if passing future holdingInputData.date than today', async () => {
			const tomorrow = MomentServiceUtil.addDays(new Date(), 1);
			const input: InvestmentAccounHoldingCreateInput = {
				holdingInputData: {
					date: tomorrow.toISOString(),
				},
			} as InvestmentAccounHoldingCreateInput;
			await expect(service.modifyInvestmentAccountHolding(input, mockUserId)).rejects.toThrowError(
				INVESTMENT_ACCOUNT_HOLDING_ERROR.UNSUPPORTRED_DATE_RANGE
			);
		});

		it(`should thrown an error if passing older holdingInputData.date than ${INVESTMENT_ACCOUNT_HOLDING_MAX_YEARS}`, async () => {
			const input: InvestmentAccounHoldingCreateInput = {
				holdingInputData: {
					date: '2011-10-05',
				},
			} as InvestmentAccounHoldingCreateInput;
			await expect(service.modifyInvestmentAccountHolding(input, mockUserId)).rejects.toThrowError(
				INVESTMENT_ACCOUNT_HOLDING_ERROR.UNSUPPORTRED_DATE_RANGE
			);
		});

		it('should thrown an error if passing weekend on holdingInputData.date', async () => {
			const input: InvestmentAccounHoldingCreateInput = {
				holdingInputData: {
					date: '2022-11-05',
				},
			} as InvestmentAccounHoldingCreateInput;
			await expect(service.modifyInvestmentAccountHolding(input, mockUserId)).rejects.toThrowError(
				INVESTMENT_ACCOUNT_HOLDING_ERROR.IS_WEEKEND
			);
		});
	});

	describe('Test: deleteHoldingHistory()', () => {
		it('should remove existing holding history', async () => {
			const input: InvestmentAccounHoldingHistoryDeleteInput = {
				investmentAccountId: investmentAccountMock2.id,
				symbol: symbolMock,
				itemId: mockHistory.itemId,
			} as InvestmentAccounHoldingHistoryDeleteInput;

			// expected holdings that should be saved to the DB
			const expectedUpdatingHoldings = mockHoldings.map((d) => {
				if (d.id === input.symbol) {
					return { ...d, holdingHistory: mockHoldings[0].holdingHistory.filter((d) => d.itemId !== input.itemId) };
				}
				return d;
			});

			const result = await service.deleteHoldingHistory(input, mockUserId);

			expect(result).toStrictEqual(mockHistory);
			expect(prismaServiceMock.investmentAccount.update).toHaveBeenCalledWith({
				data: {
					holdings: [...expectedUpdatingHoldings],
				},
				where: {
					id: input.investmentAccountId,
				},
			});
		});

		it('should thrown an error if removing holding history does not exist', async () => {
			const input: InvestmentAccounHoldingHistoryDeleteInput = {
				investmentAccountId: investmentAccountMock2.id,
				symbol: 'NOT_EXISTING',
			} as InvestmentAccounHoldingHistoryDeleteInput;

			await expect(service.deleteHoldingHistory(input, mockUserId)).rejects.toThrowError(
				INVESTMENT_ACCOUNT_HOLDING_ERROR.NOT_FOUND
			);
		});
	});
});

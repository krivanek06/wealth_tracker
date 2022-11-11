import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { when } from 'jest-when';
import { FinancialModelingAPIService } from '../../../api';
import { PrismaService } from '../../../prisma';
import { AssetStock, AssetStockProfile } from '../entities';
import { AssetStockService } from '../services';
import { AssetStockUtil } from '../utils';

describe('AssetStockService', () => {
	let service: AssetStockService;
	const symbolMock = 'AAPL';

	const assetProfilMock: AssetStockProfile = {
		ceo: 'Test name1',
	} as AssetStockProfile;

	const assetMock: AssetStock = {
		id: symbolMock,
		profile: {
			...assetProfilMock,
		},
	} as AssetStock;

	// mock services
	AssetStockUtil.convertFMProfileToAssetStockProfile = jest.fn().mockReturnValue(assetProfilMock);

	const prismaServiceMock: PrismaService = createMock<PrismaService>({
		assetStock: {
			create: jest.fn(),
			findFirst: jest.fn(),
		},
	});
	const financialModelingAPIServiceMock: FinancialModelingAPIService = createMock<FinancialModelingAPIService>({
		getStockProfile: jest.fn(),
	});

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AssetStockService,
				{ provide: PrismaService, useValue: prismaServiceMock },
				{ provide: FinancialModelingAPIService, useValue: financialModelingAPIServiceMock },
			],
		}).compile();

		service = module.get<AssetStockService>(AssetStockService);

		when(prismaServiceMock.assetStock.findFirst)
			.calledWith({
				where: {
					id: symbolMock,
				},
			})
			.mockResolvedValue(assetMock);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('Test: getStockBySymbol()', () => {
		it('should return maching stock by symbol', async () => {
			const result = await service.getStockBySymbol(symbolMock);

			expect(prismaServiceMock.assetStock.findFirst).toHaveBeenCalledWith({
				where: {
					id: symbolMock,
				},
			});
			expect(result).toStrictEqual(assetMock);
		});
	});

	describe('Test: refreshStockIntoDatabase()', () => {
		it('should refresh stock record does not exist', async () => {
			const symbol = 'AAA';
			const expectedResult: AssetStock = { ...assetMock, id: symbol };

			await service.refreshStockIntoDatabase(symbol);

			expect(financialModelingAPIServiceMock.getStockProfile).toHaveBeenCalledWith(symbol);
			expect(prismaServiceMock.assetStock.findFirst).toHaveBeenCalled();
			expect(prismaServiceMock.assetStock.create).toHaveBeenCalledWith({
				data: {
					...expectedResult,
				},
			});
		});

		it('should not refresh if record exist and just return value', async () => {
			const result = await service.refreshStockIntoDatabase(symbolMock);

			expect(prismaServiceMock.assetStock.findFirst).toHaveBeenCalled();
			expect(prismaServiceMock.assetStock.create).not.toHaveBeenCalled();
			expect(result).toStrictEqual(assetMock);
		});
	});
});

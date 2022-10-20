import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { when } from 'jest-when';
import { PrismaService } from '../../../prisma';
import { AssetStock } from '../entities';
import { AssetStockService } from '../services';
import { CreateAssetStockUtil } from '../utils';
import { FinancialModelingAPIService } from './../../../api';

describe('AssetStockService', () => {
	let service: AssetStockService;
	const symbolMock = 'AAPL';
	const assetMock: AssetStock = {
		symbol: symbolMock,
	} as AssetStock;

	// mock services
	CreateAssetStockUtil.createAssetStock = jest.fn().mockReturnValue(assetMock);
	const prismaServiceMock: PrismaService = createMock<PrismaService>({
		assetStock: {
			create: jest.fn().mockResolvedValue(assetMock),
			findFirst: jest.fn(),
		},
	});
	const financialModelingAPIServiceMock: FinancialModelingAPIService = createMock<FinancialModelingAPIService>({});

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
					symbol: symbolMock,
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
					symbol: symbolMock,
				},
			});
			expect(result).toStrictEqual(assetMock);
		});
	});

	describe('Test: refreshStockIntoDatabase()', () => {
		it('should refresh stock record does not exist', async () => {
			const result = await service.refreshStockIntoDatabase('TEST');

			expect(prismaServiceMock.assetStock.findFirst).toHaveBeenCalled();
			expect(prismaServiceMock.assetStock.create).toHaveBeenCalledWith({
				data: {
					...assetMock,
				},
			});
			expect(result).toStrictEqual(assetMock);
		});

		it('should not refresh if record exist and just return value', async () => {
			const result = await service.refreshStockIntoDatabase(symbolMock);

			expect(prismaServiceMock.assetStock.findFirst).toHaveBeenCalled();
			expect(prismaServiceMock.assetStock.create).not.toHaveBeenCalled();
			expect(result).toStrictEqual(assetMock);
		});
	});
});

import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { when } from 'jest-when';
import { AssetGeneralService } from '../services';
import { FinancialModelingAPIService } from './../../../api/financial-modeling/financial-modeling-api.service';
import { PrismaService } from './../../../prisma/prisma.service';

describe('AssetGeneralService', () => {
	let service: AssetGeneralService;
	const symbolMock = 'AAPL';

	const prismaServiceMock: PrismaService = createMock<PrismaService>({
		assetGeneral: {
			create: jest.fn(),
			findFirst: jest.fn(),
		},
		assetGeneralHistoricalPrices: {
			findFirst: jest.fn(),
			upsert: jest.fn(),
		},
	});
	const financialModelingAPIServiceMock: FinancialModelingAPIService = createMock<FinancialModelingAPIService>({
		getStockProfile: jest.fn(),
		searchAssetBySymbolPrefix: jest.fn(),
	});

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AssetGeneralService,
				{ provide: PrismaService, useValue: prismaServiceMock },
				{ provide: FinancialModelingAPIService, useValue: financialModelingAPIServiceMock },
			],
		}).compile();

		service = module.get<AssetGeneralService>(AssetGeneralService);

		when(prismaServiceMock.assetStock.findFirst)
			.calledWith({
				where: {
					id: symbolMock,
				},
			})
			.mockResolvedValue();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('Test: searchAssetBySymbol()', () => {
		it('should return searched stocks', async () => {});
	});

	describe('Test: getAssetBySymbol()', () => {
		it('should load asset data from database');
	});
});

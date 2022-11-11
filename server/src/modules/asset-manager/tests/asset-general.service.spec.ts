import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { when } from 'jest-when';
import { FinancialModelingAPIService, FMQuote, FMSearch } from '../../../api';
import { PrismaService } from '../../../prisma';
import { MomentServiceUtil } from '../../../utils';
import { ASSET_HISTORICAL_ERROR, ASSET_PRICE_UPDATE_THRESHOLD_HOURS } from '../dto';
import { AssetGeneral, AssetGeneralHistoricalPrices, AssetGeneralQuote } from '../entities';
import { AssetGeneralService } from '../services';
import { AssetGeneralUtil } from '../utils';

describe('AssetGeneralService', () => {
	let service: AssetGeneralService;
	const symbolMock1 = 'symbolMock1';
	const symbolMock2 = 'symbolMock2';
	const symbolMock3 = 'symbolMock3';

	AssetGeneralUtil.convertFMQuoteToAssetGeneralQuote = jest.fn();

	// example of good assetIntoLastUpdate
	const symbolMock1AssetGeneral: AssetGeneral = {
		id: symbolMock1,
		assetIntoLastUpdate: new Date(),
	} as AssetGeneral;

	// example of old assetIntoLastUpdate
	const symbolMock2AssetGeneral: AssetGeneral = {
		id: symbolMock2,
		assetIntoLastUpdate: MomentServiceUtil.subHours(new Date(), ASSET_PRICE_UPDATE_THRESHOLD_HOURS + 1),
	} as AssetGeneral;
	const symbolMock2AssetQuote: AssetGeneralQuote = {
		symbol: symbolMock2AssetGeneral.id,
		name: symbolMock2AssetGeneral.name,
		symbolImageURL: symbolMock2AssetGeneral.symbolImageURL,
	} as AssetGeneralQuote;

	// not saved in DB
	const symbolMock3AssetGeneral: AssetGeneral = {
		id: symbolMock3,
		assetIntoLastUpdate: MomentServiceUtil.subHours(new Date(), ASSET_PRICE_UPDATE_THRESHOLD_HOURS + 1),
	} as AssetGeneral;
	const symbolMock3AssetQuote: AssetGeneralQuote = {
		symbol: symbolMock3AssetGeneral.id,
		name: symbolMock3AssetGeneral.name,
		symbolImageURL: symbolMock3AssetGeneral.symbolImageURL,
	} as AssetGeneralQuote;

	const prismaServiceMock: PrismaService = createMock<PrismaService>({
		assetGeneral: {
			create: jest.fn(),
			findFirst: jest.fn(),
			upsert: jest.fn(),
			findMany: jest.fn(),
		},
		assetGeneralHistoricalPrices: {
			findFirst: jest.fn(),
			upsert: jest.fn(),
		},
	});
	const financialModelingAPIServiceMock: FinancialModelingAPIService = createMock<FinancialModelingAPIService>({
		getStockProfile: jest.fn(),
		searchAssetBySymbolPrefix: jest.fn(),
		getAssetHistoricalPrices: jest.fn(),
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
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('Test: searchAssetBySymbol()', () => {
		when(prismaServiceMock.assetGeneral.findMany)
			.calledWith({
				where: {
					id: {
						in: [symbolMock1, symbolMock2],
					},
				},
			})
			.mockResolvedValue([symbolMock1AssetGeneral, symbolMock2AssetGeneral])
			.calledWith({
				where: {
					id: {
						in: [],
					},
				},
			})
			.mockResolvedValue([]);

		beforeEach(() => {
			const searchedSymbols: FMSearch[] = [{ symbol: symbolMock1 } as FMSearch, { symbol: symbolMock2 } as FMSearch];

			when(financialModelingAPIServiceMock.searchAssetBySymbolPrefix)
				.calledWith(symbolMock1, false)
				.mockResolvedValue(searchedSymbols)
				.calledWith(symbolMock1, true)
				.mockResolvedValue(searchedSymbols)
				.calledWith(symbolMock2, false)
				.mockResolvedValue([]);
		});

		it('should return searched stocks for existing API response', async () => {
			const result1 = await service.searchAssetBySymbol(symbolMock1, false);
			const result2 = await service.searchAssetBySymbol(symbolMock1, true);

			expect(result1).toStrictEqual([symbolMock1AssetGeneral, symbolMock2AssetGeneral]);
			expect(result2).toStrictEqual([symbolMock1AssetGeneral, symbolMock2AssetGeneral]);
		});

		it('should return searched stocks for empty API response', async () => {
			const response = await service.searchAssetBySymbol(symbolMock2, false);
			expect(response).toEqual([]);
			expect(response.length).toEqual(0);
		});
	});

	describe('Test: getAssetGeneralForSymbol()', () => {
		const symbolMockNotExists = 'symbolMockNotExists';
		when(prismaServiceMock.assetGeneral.findMany)
			.calledWith({
				where: {
					id: {
						in: [symbolMock1],
					},
				},
			})
			.mockResolvedValue([symbolMock1AssetGeneral])
			.calledWith({
				where: {
					id: {
						in: [symbolMockNotExists],
					},
				},
			})
			.mockResolvedValue([]);

		it('should return asset general info for symbol', async () => {
			const result = await service.getAssetGeneralForSymbol(symbolMock1);
			expect(result).toStrictEqual(symbolMock1AssetGeneral);
		});

		it('should return null if asset general info for symbol not found', async () => {
			const result = await service.getAssetGeneralForSymbol(symbolMockNotExists);
			expect(result).toBeNull();
		});
	});

	describe('Test: getAssetGeneralForSymbols()', () => {
		const symbolMock2FMQuote: FMQuote = {
			symbol: symbolMock2,
		} as FMQuote;
		const symbolMock3FMQuote: FMQuote = {
			symbol: symbolMock3,
		} as FMQuote;

		when(prismaServiceMock.assetGeneral.findMany)
			.calledWith({
				where: {
					id: {
						in: [symbolMock1, symbolMock2], // symbol2 incorrect assetIntoLastUpdate
					},
				},
			})
			.mockResolvedValue([symbolMock1AssetGeneral, symbolMock2AssetGeneral])
			.calledWith({
				where: {
					id: {
						in: [symbolMock1], // correct assetIntoLastUpdate
					},
				},
			})
			.mockResolvedValue([symbolMock1AssetGeneral])
			.calledWith({
				where: {
					id: {
						in: [symbolMock1, symbolMock3], // not returning value for symbolMock3
					},
				},
			})
			.mockResolvedValue([symbolMock1AssetGeneral]);

		when(prismaServiceMock.assetGeneral.upsert)
			.calledWith({
				create: {
					id: symbolMock3AssetQuote.symbol,
					symbolImageURL: symbolMock3AssetQuote.symbolImageURL,
					name: symbolMock3AssetQuote.name,
					assetQuote: symbolMock3AssetQuote,
				},
				update: {
					symbolImageURL: symbolMock3AssetQuote.symbolImageURL,
					name: symbolMock3AssetQuote.name,
					assetQuote: symbolMock3AssetQuote,
				},
				where: {
					id: symbolMock3AssetQuote.symbol,
				},
			})
			.mockResolvedValue(symbolMock3AssetGeneral)
			.calledWith({
				create: {
					id: symbolMock2AssetQuote.symbol,
					symbolImageURL: symbolMock2AssetQuote.symbolImageURL,
					name: symbolMock2AssetQuote.name,
					assetQuote: symbolMock2AssetQuote,
				},
				update: {
					symbolImageURL: symbolMock2AssetQuote.symbolImageURL,
					name: symbolMock2AssetQuote.name,
					assetQuote: symbolMock2AssetQuote,
				},
				where: {
					id: symbolMock2AssetQuote.symbol,
				},
			})
			.mockResolvedValue(symbolMock2AssetGeneral);

		// mock API response
		when(financialModelingAPIServiceMock.getAssetQuotes)
			.calledWith([symbolMock2])
			.mockResolvedValue([symbolMock2FMQuote])
			.calledWith([symbolMock3])
			.mockResolvedValue([symbolMock3FMQuote]);

		// mock converting
		when(AssetGeneralUtil.convertFMQuoteToAssetGeneralQuote)
			.calledWith(symbolMock2FMQuote)
			.mockReturnValue(symbolMock2AssetQuote)
			.calledWith(symbolMock3FMQuote)
			.mockReturnValue(symbolMock3AssetQuote);

		it('should NOT call refresh symbol quotes for recent assetIntoLastUpdate', async () => {
			const result = await service.getAssetGeneralForSymbols([symbolMock1]);

			// check DB loading
			expect(prismaServiceMock.assetGeneral.findMany).toHaveBeenCalledWith({
				where: {
					id: {
						in: [symbolMock1],
					},
				},
			});
			expect(result).toStrictEqual([symbolMock1AssetGeneral]);
			expect(financialModelingAPIServiceMock.getAssetQuotes).not.toBeCalled();
		});

		it('should call refresh symbol quotes in DB if too old', async () => {
			const result = await service.getAssetGeneralForSymbols([symbolMock1, symbolMock2]);

			// check DB loading
			expect(prismaServiceMock.assetGeneral.findMany).toHaveBeenCalledWith({
				where: {
					id: {
						in: [symbolMock1, symbolMock2],
					},
				},
			});
			expect(financialModelingAPIServiceMock.getAssetQuotes).toBeCalledWith([symbolMock2]);
			expect(financialModelingAPIServiceMock.getAssetQuotes).not.toBeCalledWith([symbolMock1]);

			// check saving data from API
			expect(prismaServiceMock.assetGeneral.upsert).toHaveBeenCalledWith({
				create: {
					id: symbolMock2AssetQuote.symbol,
					symbolImageURL: symbolMock2AssetQuote.symbolImageURL,
					name: symbolMock2AssetQuote.name,
					assetQuote: symbolMock2AssetQuote,
				},
				update: {
					symbolImageURL: symbolMock2AssetQuote.symbolImageURL,
					name: symbolMock2AssetQuote.name,
					assetQuote: symbolMock2AssetQuote,
				},
				where: {
					id: symbolMock2AssetQuote.symbol,
				},
			});

			expect(result).toStrictEqual([symbolMock1AssetGeneral, symbolMock2AssetGeneral]);
		});

		it('should call refresh symbol quotes in DB if not exists', async () => {
			const result = await service.getAssetGeneralForSymbols([symbolMock1, symbolMock3]);

			expect(financialModelingAPIServiceMock.getAssetQuotes).toBeCalledWith([symbolMock3]);
			expect(financialModelingAPIServiceMock.getAssetQuotes).not.toBeCalledWith([symbolMock1]);

			expect(prismaServiceMock.assetGeneral.upsert).toHaveBeenCalledWith({
				create: {
					id: symbolMock3AssetQuote.symbol,
					symbolImageURL: symbolMock3AssetQuote.symbolImageURL,
					name: symbolMock3AssetQuote.name,
					assetQuote: symbolMock3AssetQuote,
				},
				update: {
					symbolImageURL: symbolMock3AssetQuote.symbolImageURL,
					name: symbolMock3AssetQuote.name,
					assetQuote: symbolMock3AssetQuote,
				},
				where: {
					id: symbolMock3AssetQuote.symbol,
				},
			});

			expect(result).toStrictEqual([symbolMock1AssetGeneral, symbolMock3AssetGeneral]);
		});
	});

	describe('Test: getAssetHistoricalPricesStartToEnd()', () => {
		const dateStart = '2022-01-02';
		const dateEnd = '2022-01-10';

		const dateStartOutside = '2022-01-01';
		const dateEndOutside = '2022-01-12';

		const dateExistingMiddle = '2022-01-05';

		const symbolMock1HistoricalSaved: AssetGeneralHistoricalPrices = {
			dateStart: dateStart,
			dateEnd: dateEnd,
			id: symbolMock1,
			assetHistoricalPricesData: [
				{
					close: 10,
					date: '2022-01-02',
				},
				{
					close: 10,
					date: '2022-01-03',
				},
				// {
				// 	close: 11,
				// 	date: '2022-01-04', // weekend
				// },
				{
					close: 11,
					date: '2022-01-05',
				},
				{
					close: 11,
					date: '2022-01-06',
				},
				{
					close: 11,
					date: '2022-01-07', // missing, because weekend
				},
				// {
				// 	close: 11,
				// 	date: '2022-01-08',
				// },
				{
					close: 11,
					date: '2022-01-09', // ending with 09, cause today is 2022-01-10
				},
			],
		};

		const symbolMock1HistoricalAPI: AssetGeneralHistoricalPrices = {
			dateStart: dateStartOutside,
			dateEnd: dateEndOutside,
			id: symbolMock1,
			assetHistoricalPricesData: [
				{
					close: 10,
					date: '2022-01-01',
				},
				...symbolMock1HistoricalSaved.assetHistoricalPricesData,
				{
					close: 10,
					date: '2022-01-10',
				},
				{
					close: 10,
					date: '2022-01-11',
				},
				{
					close: 10,
					date: '2022-01-12',
				},
			],
		};
		when(prismaServiceMock.assetGeneralHistoricalPrices.findFirst)
			.calledWith({
				where: {
					id: symbolMock1,
				},
			})
			.mockResolvedValue(symbolMock1HistoricalSaved);

		when(prismaServiceMock.assetGeneralHistoricalPrices.upsert).mockResolvedValue(symbolMock1HistoricalAPI);

		when(financialModelingAPIServiceMock.getAssetHistoricalPrices).mockResolvedValue(
			symbolMock1HistoricalAPI.assetHistoricalPricesData
		);

		it('should thrown an Error if end date is before start date', async () => {
			await expect(service.getAssetHistoricalPricesStartToEnd(symbolMock1, dateEnd, dateStart)).rejects.toThrowError(
				ASSET_HISTORICAL_ERROR.BAD_INPUT_DATE
			);
		});

		it('should NOT call getAssetHistoricalPrices if dates with range [AssetGeneralHistoricalPrices.startDate, AssetGeneralHistoricalPrices.endDate]', async () => {
			const result = await service.getAssetHistoricalPricesStartToEnd(symbolMock1, dateExistingMiddle, '2022-01-07');

			const dd = symbolMock1HistoricalSaved.assetHistoricalPricesData;
			const expectedResult: AssetGeneralHistoricalPrices = {
				id: symbolMock1HistoricalSaved.id,
				dateStart: dateExistingMiddle,
				dateEnd: '2022-01-07',
				assetHistoricalPricesData: [dd[2], dd[3], dd[4]],
			};

			expect(financialModelingAPIServiceMock.getAssetHistoricalPrices).not.toBeCalled();
			expect(prismaServiceMock.assetGeneralHistoricalPrices.upsert).not.toBeCalled();
			expect(result).toStrictEqual(expectedResult);
		});

		it('should call getAssetHistoricalPrices to fetch data for [start, end] date range', async () => {
			// test for dateStart sooner than saved - increase date start
			await service.getAssetHistoricalPricesStartToEnd(symbolMock1, dateStartOutside, dateExistingMiddle);
			expect(financialModelingAPIServiceMock.getAssetHistoricalPrices).toHaveBeenCalledWith(
				symbolMock1,
				dateStartOutside,
				dateEnd
			);
			expect(prismaServiceMock.assetGeneralHistoricalPrices.upsert).toHaveBeenCalledWith({
				create: {
					id: symbolMock1,
					dateStart: dateStartOutside,
					dateEnd: dateEnd,
					assetHistoricalPricesData: symbolMock1HistoricalAPI.assetHistoricalPricesData,
				},
				update: {
					dateStart: dateStartOutside,
					dateEnd: dateEnd,
					assetHistoricalPricesData: symbolMock1HistoricalAPI.assetHistoricalPricesData,
				},
				where: {
					id: symbolMock1,
				},
			});

			// test for dateEnd later than saved - increase date end
			await service.getAssetHistoricalPricesStartToEnd(symbolMock1, dateExistingMiddle, dateEndOutside);
			expect(financialModelingAPIServiceMock.getAssetHistoricalPrices).toHaveBeenCalledWith(
				symbolMock1,
				dateStart,
				dateEndOutside
			);
			expect(prismaServiceMock.assetGeneralHistoricalPrices.upsert).toHaveBeenCalledWith({
				create: {
					id: symbolMock1,
					dateStart: dateStart,
					dateEnd: dateEndOutside,
					assetHistoricalPricesData: symbolMock1HistoricalAPI.assetHistoricalPricesData,
				},
				update: {
					dateStart: dateStart,
					dateEnd: dateEndOutside,
					assetHistoricalPricesData: symbolMock1HistoricalAPI.assetHistoricalPricesData,
				},
				where: {
					id: symbolMock1,
				},
			});

			// test both outside range - increase both
			await service.getAssetHistoricalPricesStartToEnd(symbolMock1, dateStartOutside, dateEndOutside);
			expect(financialModelingAPIServiceMock.getAssetHistoricalPrices).toHaveBeenCalledWith(
				symbolMock1,
				dateStartOutside,
				dateEndOutside
			);
			expect(prismaServiceMock.assetGeneralHistoricalPrices.upsert).toHaveBeenCalledWith({
				create: {
					id: symbolMock1,
					dateStart: dateStartOutside,
					dateEnd: dateEndOutside,
					assetHistoricalPricesData: symbolMock1HistoricalAPI.assetHistoricalPricesData,
				},
				update: {
					dateStart: dateStartOutside,
					dateEnd: dateEndOutside,
					assetHistoricalPricesData: symbolMock1HistoricalAPI.assetHistoricalPricesData,
				},
				where: {
					id: symbolMock1,
				},
			});
		});

		it('should return assetHistoricalPricesData first next value if [start, end] are weekends', async () => {
			const weekendStart = '2022-01-04';
			const weekendEnd = '2022-01-08';

			const result = await service.getAssetHistoricalPricesStartToEnd(symbolMock1, weekendStart, weekendEnd);
			const dd = symbolMock1HistoricalSaved.assetHistoricalPricesData;
			const expectedResult: AssetGeneralHistoricalPrices = {
				id: symbolMock1HistoricalSaved.id,
				dateStart: '2022-01-05',
				dateEnd: '2022-01-09',
				assetHistoricalPricesData: [dd[2], dd[3], dd[4], dd[5]],
			};

			expect(financialModelingAPIServiceMock.getAssetHistoricalPrices).not.toBeCalled();
			expect(prismaServiceMock.assetGeneralHistoricalPrices.upsert).not.toBeCalled();
			expect(result).toStrictEqual(expectedResult);
		});

		it('shoud return whole assetHistoricalPricesData until the end if endIndex is today', async () => {
			const today = '2022-01-13';

			const result = await service.getAssetHistoricalPricesStartToEnd(symbolMock1, dateStartOutside, today);
			expect(financialModelingAPIServiceMock.getAssetHistoricalPrices).toHaveBeenCalledWith(
				symbolMock1,
				dateStartOutside,
				today
			);
			expect(prismaServiceMock.assetGeneralHistoricalPrices.upsert).toHaveBeenCalledWith({
				create: {
					id: symbolMock1,
					dateStart: dateStartOutside,
					dateEnd: today,
					assetHistoricalPricesData: symbolMock1HistoricalAPI.assetHistoricalPricesData,
				},
				update: {
					dateStart: dateStartOutside,
					dateEnd: today,
					assetHistoricalPricesData: symbolMock1HistoricalAPI.assetHistoricalPricesData,
				},
				where: {
					id: symbolMock1,
				},
			});

			expect(result).toStrictEqual(symbolMock1HistoricalAPI);
		});
	});
});

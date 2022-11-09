import { Injectable } from '@nestjs/common';
import { FinancialModelingAPIService } from '../../../api';
import { PrismaService } from '../../../prisma';
import { AssetGeneral, AssetGeneralHistoricalPrices } from '../entities';
import { AssetGeneralSearch } from '../outputs';
import { AssetGeneralUtil } from '../utils';
import { MomentServiceUtil } from './../../../utils';

@Injectable()
export class AssetGeneralService {
	constructor(private prisma: PrismaService, private financialModelingAPIService: FinancialModelingAPIService) {}

	async searchAssetBySymbol(symbolPrefix: string, isCrypto = false): Promise<AssetGeneralSearch[]> {
		const apiData = await this.financialModelingAPIService.searchAssetBySymbolPrefix(symbolPrefix, isCrypto);
		return apiData.map((d) => {
			return {
				name: d.name,
				currency: d.currency,
				exchangeShortName: d.exchangeShortName,
				stockExchange: d.exchangeShortName,
				symbol: d.symbol,
			};
		});
	}

	getAssetBySymbol(symbol: string): Promise<AssetGeneral> {
		return this.prisma.assetGeneral.findFirst({
			where: {
				id: symbol,
			},
		});
	}

	getAssetHistoricalPrices(symbol: string): Promise<AssetGeneralHistoricalPrices> {
		return this.prisma.assetGeneralHistoricalPrices.findFirst({
			where: {
				id: symbol,
			},
		});
	}

	async getAssetHistoricalPricesStartToEnd(
		symbol: string,
		start: string,
		end: string
	): Promise<AssetGeneralHistoricalPrices> {
		const historicalPrices = await this.refreshHistoricalPriceIntoDatabase(symbol, start, end);
		const startIndex = historicalPrices.assetHistoricalPricesData.findIndex((d) => d.date === start);
		const endIndex = historicalPrices.assetHistoricalPricesData.findIndex((d) => d.date === end);

		if (startIndex === -1 || endIndex === -1) {
			throw new Error(`Index error for symbol: ${symbol}, start: ${startIndex}, end ${endIndex}`);
		}

		const priceSlice = historicalPrices.assetHistoricalPricesData.slice(startIndex, endIndex - 1);
		return { id: symbol, dateStart: start, dateEnd: end, assetHistoricalPricesData: priceSlice };
	}

	async refreshHistoricalPriceIntoDatabase(
		symbol: string,
		start: string,
		end: string
	): Promise<AssetGeneralHistoricalPrices> {
		const dateStart = new Date(start);
		const dateEnd = new Date(end);
		const savedData = await this.getAssetHistoricalPrices(symbol);

		// check if exists or dateStart, dateEnd in range
		const refreshData =
			!savedData ||
			MomentServiceUtil.isBefore(dateStart, savedData.dateStart) ||
			MomentServiceUtil.isBefore(savedData.dateEnd, dateEnd);

		// data in range
		if (!refreshData) {
			return savedData;
		}

		// load data from API
		const apiData = await this.financialModelingAPIService.getAssetHistoricalPrices(symbol, dateStart, dateEnd);

		// save historical prices
		return this.prisma.assetGeneralHistoricalPrices.upsert({
			create: {
				id: symbol,
				dateStart: start,
				dateEnd: end,
				assetHistoricalPricesData: apiData,
			},
			update: {
				dateStart: start,
				dateEnd: end,
				assetHistoricalPricesData: apiData,
			},
			where: {
				id: symbol,
			},
		});
	}

	/**
	 * Load and persist asset symbol data to the DB if not already saved,
	 *
	 * @param symbol stock symbol
	 */
	async refreshAssetIntoDatabase(symbol: string): Promise<AssetGeneral> {
		// if symbol already saved, skip
		const symbolData = await this.getAssetBySymbol(symbol);

		// record exists
		if (!!symbolData) {
			return symbolData;
		}

		// load symbol data from the API
		const data = await this.getAssetStockFromAPI(symbol);

		// save symbol data
		return this.prisma.assetGeneral.create({
			data: {
				...data,
			},
		});
	}

	private async getAssetStockFromAPI(symbol: string): Promise<AssetGeneral> {
		// load data
		const assetQuoteApi = await this.financialModelingAPIService.getAssetQuote(symbol);

		// create entity
		const assetQuote = AssetGeneralUtil.convertFMQuoteToAssetGeneralQuote(assetQuoteApi);

		// create result
		const result: AssetGeneral = {
			id: symbol,
			symbolImageURL: assetQuoteApi.symbolImage,
			name: assetQuoteApi.name,
			assetIntoLastUpdate: new Date(assetQuoteApi.timestamp),
			assetQuote,
		};

		return result;
	}
}

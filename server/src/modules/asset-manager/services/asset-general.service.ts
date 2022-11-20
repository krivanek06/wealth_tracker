import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FinancialModelingAPIService } from '../../../api';
import { PrismaService } from '../../../prisma';
import { MomentServiceUtil } from '../../../utils';
import { ASSET_HISTORICAL_ERROR, ASSET_PRICE_UPDATE_THRESHOLD_HOURS } from '../dto';
import { AssetGeneral, AssetGeneralHistoricalPrices, AssetGeneralHistoricalPricesData } from '../entities';
import { AssetGeneralUtil } from '../utils';

@Injectable()
export class AssetGeneralService {
	constructor(private prisma: PrismaService, private financialModelingAPIService: FinancialModelingAPIService) {}

	async searchAssetBySymbol(symbolPrefix: string, isCrypto = false): Promise<AssetGeneral[]> {
		const apiData = await this.financialModelingAPIService.searchAssetBySymbolPrefix(symbolPrefix, isCrypto);
		const symbolNames = apiData.map((d) => d.symbol);
		return this.getAssetGeneralForSymbols(symbolNames);
	}

	async getAssetGeneralForSymbol(symbol: string): Promise<AssetGeneral | null> {
		const result = await this.getAssetGeneralForSymbols([symbol]);
		return result[0] ?? null;
	}

	/**
	 * For each symbols loads AssetGeneral data from the DB and check if they
	 * are not recent data, refresh them from the API
	 *
	 * @param symbols an array of symbols we want to get back current AssetGeneral
	 *
	 * TODO implement caching
	 */
	async getAssetGeneralForSymbols(symbols: string[]): Promise<AssetGeneral[]> {
		// load general data from all assets
		const existingAssetsGeneralData = await this.prisma.assetGeneral.findMany({
			where: {
				id: {
					in: symbols,
				},
			},
		});
		const assetsGeneralDataSymbols = existingAssetsGeneralData.map((d) => d.id);

		// filter out outdated data older than STOCK_PRICE_UPDATE_THRESHOLD_HOURS hours
		const outDatedSymbols = existingAssetsGeneralData
			.filter(
				(d) =>
					MomentServiceUtil.getDifference(d.assetIntoLastUpdate, new Date(), 'hours') >
					ASSET_PRICE_UPDATE_THRESHOLD_HOURS
			)
			.map((d) => d.id);
		const notExistingSymbols = symbols.filter((d) => !assetsGeneralDataSymbols.includes(d));

		// update outdated symbols data in DB from API
		const updatedQuotes = await this.refreshSymbolQuotesInDB([...outDatedSymbols, ...notExistingSymbols]);

		// create key value map for better accessibility, so we don't need to use find()
		const updatedQuotesMap = new Map(updatedQuotes.map((e) => [e.id, e]));
		const existingAssetQuotesMap = new Map(existingAssetsGeneralData.map((e) => [e.id, e]));

		// replace updatedQuotes in assetsGeneralData
		const mergedQuotes = symbols
			.map((symbol) =>
				updatedQuotesMap.has(symbol) ? updatedQuotesMap.get(symbol) : existingAssetQuotesMap.get(symbol)
			)
			// may happen that we query some symbol that does not exists and undefined will be in the returning value
			.filter((d) => !!d);

		return mergedQuotes;
	}

	async getAssetGeneralHistoricalPricesDataOnDate(
		symbol: string,
		date: string
	): Promise<AssetGeneralHistoricalPricesData> {
		const prices = await this.getAssetHistoricalPricesStartToEnd(symbol, date, new Date().toISOString());
		return prices.assetHistoricalPricesData[0];
	}

	async getAssetHistoricalPricesStartToEnd(
		symbol: string,
		start: string,
		end: string
	): Promise<AssetGeneralHistoricalPrices> {
		const historicalPrices = await this.refreshHistoricalPriceIntoDatabase(symbol, start, end);

		// using >= because we may choose from weekend
		const startIndex = historicalPrices.assetHistoricalPricesData.findIndex((d) => d.date >= start);
		const endIndex = historicalPrices.assetHistoricalPricesData.findIndex((d) => d.date >= end);

		// if end index not found, return until the end - can happen if we select today
		const endIndexFixed = endIndex === -1 ? historicalPrices.assetHistoricalPricesData.length : endIndex;

		// slice returning historical data
		const priceSlice = historicalPrices.assetHistoricalPricesData.slice(startIndex, endIndexFixed + 1);

		return {
			id: symbol,
			dateStart: priceSlice[0].date,
			dateEnd: priceSlice[priceSlice.length - 1].date,
			assetHistoricalPricesData: priceSlice,
		};
	}

	private async refreshHistoricalPriceIntoDatabase(
		symbol: string,
		start: string,
		end: string
	): Promise<AssetGeneralHistoricalPrices> {
		if (MomentServiceUtil.isBefore(end, start)) {
			throw new HttpException(ASSET_HISTORICAL_ERROR.BAD_INPUT_DATE, HttpStatus.BAD_REQUEST);
		}

		// load historical prices
		const savedData = await this.prisma.assetGeneralHistoricalPrices.findFirst({
			where: {
				id: symbol,
			},
		});

		// check if exists or dateStart, dateEnd in range
		const refreshData =
			!savedData ||
			MomentServiceUtil.isBefore(start, savedData.dateStart) ||
			MomentServiceUtil.isBefore(savedData.dateEnd, end);

		// data in range
		if (!refreshData) {
			return savedData;
		}

		// always increase the range to save the historical data
		const newStart = !savedData || MomentServiceUtil.isBefore(start, savedData.dateStart) ? start : savedData.dateStart;
		const newEnd = !savedData || MomentServiceUtil.isBefore(savedData.dateEnd, end) ? end : savedData.dateEnd;

		// load data from API
		const apiData = await this.financialModelingAPIService.getAssetHistoricalPrices(symbol, newStart, newEnd);

		// save historical prices
		return this.prisma.assetGeneralHistoricalPrices.upsert({
			create: {
				id: symbol,
				dateStart: newStart,
				dateEnd: newEnd,
				assetHistoricalPricesData: apiData,
			},
			update: {
				dateStart: newStart,
				dateEnd: newEnd,
				assetHistoricalPricesData: apiData,
			},
			where: {
				id: symbol,
			},
		});
	}

	private async refreshSymbolQuotesInDB(outDatedSymbols: string[]): Promise<AssetGeneral[]> {
		if (outDatedSymbols.length === 0) {
			return [];
		}

		const assetQuotesAPI = await this.financialModelingAPIService.getAssetQuotes(outDatedSymbols);
		const assetQuotes = assetQuotesAPI.map((d) => AssetGeneralUtil.convertFMQuoteToAssetGeneralQuote(d));

		return Promise.all(
			assetQuotes.map((d) =>
				this.prisma.assetGeneral.upsert({
					create: {
						id: d.symbol,
						symbolImageURL: d.symbolImageURL,
						name: d.name,
						assetQuote: d,
					},
					update: {
						symbolImageURL: d.symbolImageURL,
						name: d.name,
						assetQuote: d,
					},
					where: {
						id: d.symbol,
					},
				})
			)
		);
	}
}

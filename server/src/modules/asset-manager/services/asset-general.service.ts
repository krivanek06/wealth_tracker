import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FinancialModelingAPIService } from '../../../api';
import { PrismaService } from '../../../prisma';
import { ASSET_HISTORICAL_ERROR, ASSET_PRICE_UPDATE_THRESHOLD_HOURS } from '../dto';
import { AssetGeneral, AssetGeneralHistoricalPrices } from '../entities';
import { AssetGeneralUtil } from '../utils';
import { MomentServiceUtil } from './../../../utils';

@Injectable()
export class AssetGeneralService {
	constructor(private prisma: PrismaService, private financialModelingAPIService: FinancialModelingAPIService) {}

	async searchAssetBySymbol(symbolPrefix: string, isCrypto = false): Promise<AssetGeneral[]> {
		const apiData = await this.financialModelingAPIService.searchAssetBySymbolPrefix(symbolPrefix, isCrypto);
		const symbolNames = apiData.map((d) => d.name);
		return this.getAssetGeneralInformationForSymbols(symbolNames);
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

	/**
	 * For each symbols loads AssetGeneral data from the DB and check if they
	 * are not recent data, refresh them from the API
	 *
	 * @param symbols an array of symbols we want to get back current AssetGeneral
	 */
	async getAssetGeneralInformationForSymbols(symbols: string[]): Promise<AssetGeneral[]> {
		// load general data from all assets
		// TODO not working
		const assetsGeneralData = await this.prisma.assetGeneral.findMany({
			where: {
				id: {
					in: symbols,
				},
			},
		});

		// filter out outdated data older than STOCK_PRICE_UPDATE_THRESHOLD_HOURS hours
		const outDatedSymbols = assetsGeneralData
			.filter(
				(d) =>
					MomentServiceUtil.getDifference(d.assetIntoLastUpdate, new Date(), 'hours') >
					ASSET_PRICE_UPDATE_THRESHOLD_HOURS
			)
			.map((d) => d.name);

		// update outdated symbols data in DB from API
		const updatedQuotes = await this.refreshSymbolQuotesInDB(outDatedSymbols);

		// replace updatedQuotes in assetsGeneralData
		const updatedQuotesMap = new Map(updatedQuotes.map((e) => [e.id, e]));
		const mergedQuotes = assetsGeneralData.map((obj) =>
			updatedQuotesMap.has(obj.id) ? updatedQuotesMap.get(obj.id) : obj
		);

		return mergedQuotes;
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

		// if we fetch for today then endIndex === -1
		const endIndexFixed = endIndex === -1 ? historicalPrices.assetHistoricalPricesData.length : endIndex;

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

		const savedData = await this.getAssetHistoricalPrices(symbol);

		// check if exists or dateStart, dateEnd in range
		const refreshData =
			!savedData ||
			MomentServiceUtil.isBefore(start, savedData.dateStart) ||
			MomentServiceUtil.isBefore(savedData.dateEnd, end);

		// data in range
		if (!refreshData) {
			return savedData;
		}

		// load data from API
		const apiData = await this.financialModelingAPIService.getAssetHistoricalPrices(symbol, start, end);

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

	private async refreshSymbolQuotesInDB(outDatedSymbols: string[]): Promise<AssetGeneral[]> {
		if (outDatedSymbols.length === 0) {
			return [];
		}

		const assetQuotesAPI = await this.financialModelingAPIService.getAssetQuotes(outDatedSymbols);
		const assetQuotes = assetQuotesAPI.map((d) => AssetGeneralUtil.convertFMQuoteToAssetGeneralQuote(d));

		return await Promise.all(
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

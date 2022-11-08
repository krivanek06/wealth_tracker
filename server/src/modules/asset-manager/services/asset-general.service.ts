import { Injectable } from '@nestjs/common';
import { FinancialModelingAPIService } from '../../../api';
import { PrismaService } from '../../../prisma';
import { AssetGeneral, AssetGeneralHistoricalPrices } from '../entities';
import { AssetGeneralUtil } from '../utils';
import { MomentServiceUtil } from './../../../utils';

@Injectable()
export class AssetGeneralService {
	constructor(private prisma: PrismaService, private financialModelingAPIService: FinancialModelingAPIService) {}

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

	async refreshHistoricalPriceIntoDatabase(
		symbol: string,
		start: string | Date,
		end: string | Date
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
				dateStart,
				dateEnd,
				assetHistoricalPricesData: apiData,
			},
			update: {
				dateStart,
				dateEnd,
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

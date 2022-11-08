import { Injectable } from '@nestjs/common';
import { FinancialModelingAPIService } from '../../../api';
import { PrismaService } from '../../../prisma';
import { AssetGeneral } from '../entities';
import { AssetGeneralUtil } from '../utils';

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

	/**
	 * Load and persist asset symbol data to the DB if not already saved,
	 *
	 * @param symbol stock symbol
	 */
	async refrestAssetIntoDatabase(symbol: string): Promise<AssetGeneral> {
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
			name: assetQuoteApi.name,
			assetIntoLastUpdate: new Date(assetQuoteApi.timestamp),
			assetQuote,
		};

		return result;
	}
}

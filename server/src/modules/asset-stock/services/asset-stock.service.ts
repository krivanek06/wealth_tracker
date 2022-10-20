import { Injectable } from '@nestjs/common';
import { AssetStock } from '../entities';
import { FinancialModelingAPIService } from './../../../api';
import { PrismaService } from './../../../prisma';

@Injectable()
export class AssetStockService {
	constructor(private prisma: PrismaService, private financialModelingAPIService: FinancialModelingAPIService) {}

	getStockBySymbol(symbol: string): Promise<AssetStock> {
		return this.prisma.assetStock.findFirst({
			where: {
				symbol,
			},
		});
	}

	/**
	 * Load and persist stock symbol data to the DB if not already saved
	 *
	 * @param symbol stock symbol
	 */
	async saveStockIntoDatabase(symbol: string): Promise<AssetStock> {
		// if symbol already saved, skip
		const stock = await this.getStockBySymbol(symbol);
		if (!!stock) {
			return stock;
		}

		// load symbol data from the API
		const data = await this.getAssetStockFromAPI(symbol);

		// save symbol data
		return this.prisma.assetStock.create({
			data: {
				...data,
			},
		});
	}

	private async getAssetStockFromAPI(symbol: string): Promise<AssetStock> {
		// load data
		const stockQuote = await this.financialModelingAPIService.getStockQuote(symbol);
		const stockProfile = await this.financialModelingAPIService.getStockProfile(symbol);

		// create entity
		const result: AssetStock = {
			id: symbol,
			...stockQuote,
			assetStockProfile: {
				...stockProfile,
			},
		};

		return result;
	}
}

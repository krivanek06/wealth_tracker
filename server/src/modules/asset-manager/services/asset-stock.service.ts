import { Injectable } from '@nestjs/common';
import { FinancialModelingAPIService } from '../../../api';
import { PrismaService } from '../../../prisma';
import { AssetStock } from '../entities';
import { AssetStockUtil } from '../utils';

@Injectable()
export class AssetStockService {
	constructor(private prisma: PrismaService, private financialModelingAPIService: FinancialModelingAPIService) {}

	getStockBySymbol(symbol: string): Promise<AssetStock> {
		return this.prisma.assetStock.findFirst({
			where: {
				id: symbol,
			},
		});
	}

	/**
	 * Load and persist stock symbol data to the DB if not already saved,
	 * or if its data is older than 2 weeks
	 *
	 * @param symbol stock symbol
	 */
	async refreshStockIntoDatabase(symbol: string): Promise<AssetStock> {
		// if symbol already saved, skip
		const stock = await this.getStockBySymbol(symbol);

		// record exists
		if (!!stock) {
			return stock;
		}

		// load data from API
		const fmProfile = await this.financialModelingAPIService.getStockProfile(symbol);

		// create entity
		const profile = AssetStockUtil.convertFMProfileToAssetStockProfile(fmProfile);

		// save symbol data
		return this.prisma.assetStock.create({
			data: {
				id: symbol,
				profile,
			},
		});
	}
}

import { Injectable } from '@nestjs/common';
import { FinancialModelingAPIService } from '../../../api';
import { PrismaService } from '../../../prisma';
import { ASSET_STOCK_SECTOR_TYPE_IMAGES } from '../dto';
import { AssetStock, AssetStockProfile } from '../entities';
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

	getSectorImageUrl(profile: AssetStockProfile): string | undefined {
		// Consumer Defensive -> consumer_defensive
		const formattedSectorName = profile.sector.toLowerCase().split(' ').join('_');
		const url = ASSET_STOCK_SECTOR_TYPE_IMAGES[formattedSectorName];
		return url;
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

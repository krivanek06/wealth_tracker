import { FMProfile } from '../../../api';
import { AssetStockProfile } from '../entities';

export class AssetStockUtil {
	static convertFMProfileToAssetStockProfile = (profile: FMProfile): AssetStockProfile => {
		const result: AssetStockProfile = {
			companyName: profile.companyName,
			currency: profile.currency,
			cik: profile.cik,
			isin: profile.isin,
			cusip: profile.cusip,
			exchange: profile.exchange,
			exchangeShortName: profile.exchangeShortName,
			industry: profile.industry,
			website: profile.website,
			description: profile.description,
			ceo: profile.ceo,
			sector: profile.sector,
			country: profile.country,
			fullTimeEmployees: profile.fullTimeEmployees,
			phone: profile.phone,
			address: profile.address,
			city: profile.city,
			state: profile.state,
			zip: profile.zip,
			image: profile.image,
			ipoDate: profile.ipoDate,
			defaultImage: profile.defaultImage,
			isEtf: profile.isEtf,
			isActivelyTrading: profile.isActivelyTrading,
			isAdr: profile.isAdr,
			isFund: profile.isFund,
		};

		return result;
	};
}

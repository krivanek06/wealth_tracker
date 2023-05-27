import { FMProfile } from '../../../api';
import { AssetStockProfile } from '../entities';

export class AssetStockUtil {
	static convertFMProfileToAssetStockProfile = (profile: FMProfile): AssetStockProfile => {
		const result: AssetStockProfile = {
			companyName: profile.companyName || 'N/A',
			currency: profile.currency,
			cik: profile.cik || 'N/A',
			isin: profile.isin || 'N/A',
			cusip: profile.cusip || 'N/A',
			exchange: profile.exchange || 'N/A',
			exchangeShortName: profile.exchangeShortName || 'N/A',
			industry: profile.industry || 'N/A',
			website: profile.website || 'N/A',
			description: profile.description,
			ceo: profile.ceo || 'N/A',
			sector: profile.sector || 'N/A',
			country: profile.country || 'N/A',
			fullTimeEmployees: profile.fullTimeEmployees || 'N/A',
			phone: profile.phone || 'N/A',
			address: profile.address || 'N/A',
			city: profile.city || 'N/A',
			state: profile.state || 'N/A',
			zip: profile.zip || 'N/A',
			image: profile.image,
			ipoDate: profile.ipoDate || 'N/A',
			defaultImage: profile.defaultImage,
			isEtf: profile.isEtf,
			isActivelyTrading: profile.isActivelyTrading,
			isAdr: profile.isAdr,
			isFund: profile.isFund,
		};

		return result;
	};
}

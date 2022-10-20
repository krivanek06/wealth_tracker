import { AssetStock, AssetStockProfile, AssetStockQuote } from '../entities';
import { FMProfile, FMQuote } from './../../../api';

export const createAssetStock = (quote: FMQuote, profile: FMProfile): AssetStock => {
	const assetStockProfile = convertFMProfileToAssetStockProfile(profile);
	const assetStockQuote = convertFMQuoteToAssetStock(quote);

	const result: AssetStock = {
		symbol: quote.symbol,
		timestamp: quote.timestamp,
		assetStockProfile,
		assetStockQuote,
	};

	return result;
};

export const convertFMQuoteToAssetStock = (quote: FMQuote): AssetStockQuote => {
	const result: AssetStockQuote = {
		symbol: quote.symbol,
		timestamp: quote.timestamp,
		price: quote.price,
		volume: quote.volume,
		name: quote.name,
		changesPercentage: quote.changesPercentage,
		change: quote.change,
		dayLow: quote.dayLow,
		dayHigh: quote.dayHigh,
		yearHigh: quote.yearHigh,
		yearLow: quote.yearLow,
		marketCap: quote.marketCap,
		priceAvg50: quote.priceAvg50,
		priceAvg200: quote.priceAvg200,
		avgVolume: quote.avgVolume,
		exchange: quote.exchange,
		open: quote.open,
		previousClose: quote.previousClose,
		eps: quote.eps,
		pe: quote.pe,
		earningsAnnouncement: quote.earningsAnnouncement,
		sharesOutstanding: quote.sharesOutstanding,
	};

	return result;
};

export const convertFMProfileToAssetStockProfile = (profile: FMProfile): AssetStockProfile => {
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

// IMAGE == https://financialmodelingprep.com/image-stock/${company.symbol}.png

// https://financialmodelingprep.com/api/v3/search?query=AA&limit=10&apikey=XXX
export interface FMSearch {
	image: string;
	symbol: string;
	name: string;
	currency: string;
	stockExchange: string;
	exchangeShortName: string;
}

// https://financialmodelingprep.com/api/v3/quote-short/AAPL?apikey=XXX
export interface FMStockPrice {
	symbol: string;
	price: number;
	volume: number;
}

// https://financialmodelingprep.com/api/v3/profile/AAPL?apikey=XXX
export interface FMProfile {
	symbol: string;
	price: number;
	beta: number | null;
	volAvg: number | null;
	mktCap: number;
	lastDiv: number | null;
	range: string | null;
	changes: number | null;
	companyName: string | null;
	currency: string;
	cik: string | null;
	isin: string | null;
	cusip: string | null;
	exchange: string;
	exchangeShortName: string;
	industry: string | null;
	website: string | null;
	description: string;
	ceo: string | null;
	sector: string | null;
	country: string;
	fullTimeEmployees: string | null;
	phone: string | null;
	address: string | null;
	city: string | null;
	state: string | null;
	zip: string | null;
	dcfDiff?: any;
	dcf: number | null;
	image: string;
	ipoDate: string;
	defaultImage: boolean;
	isEtf: boolean;
	isActivelyTrading: boolean;
	isAdr: boolean;
	isFund: boolean;
}

// https://financialmodelingprep.com/api/v3/quote/AAPL?apikey=XXX
export interface FMQuote {
	symbol: string;
	symbolImage: string;
	name: string;
	price: number;
	changesPercentage: number;
	change: number;
	dayLow: number;
	dayHigh: number;
	yearHigh: number;
	yearLow: number;
	marketCap: number;
	priceAvg50: number;
	priceAvg200: number;
	volume: number;
	avgVolume: number;
	exchange: string;
	open: number;
	previousClose: number;
	eps: number | null;
	pe: number | null;
	earningsAnnouncement: string | null;
	sharesOutstanding: number;
	timestamp: number;
}

// https://financialmodelingprep.com/api/v3/historical-price-full/BTCUSD?from=2021-03-12&to=2022-03-12&apikey=XXX
export interface FMAssetHistoricalPricesLine {
	date: string; // format YYYY-MM-DD
	close: number;
}

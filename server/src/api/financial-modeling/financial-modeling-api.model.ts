// IMAGE == https://financialmodelingprep.com/image-stock/${company.symbol}.png

// https://financialmodelingprep.com/api/v3/search?query=AA&limit=10&apikey=XXX
export interface FMSearch {
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
	beta: number;
	volAvg: number;
	mktCap: number;
	lastDiv: number;
	range: string;
	changes: number;
	companyName: string;
	currency: string;
	cik: string;
	isin: string;
	cusip: string;
	exchange: string;
	exchangeShortName: string;
	industry: string;
	website: string;
	description: string;
	ceo: string;
	sector: string;
	country: string;
	fullTimeEmployees: string;
	phone: string;
	address: string;
	city: string;
	state: string;
	zip: string;
	dcfDiff?: any;
	dcf: number;
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
	eps?: number;
	pe?: number;
	earningsAnnouncement?: Date;
	sharesOutstanding: number;
	timestamp: number;
}

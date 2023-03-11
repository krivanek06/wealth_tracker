import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AxiosRequestConfig } from 'axios';
import { lastValueFrom, map } from 'rxjs';
import { LodashServiceUtil, MomentServiceUtil } from './../../utils';
import {
	FMAssetHistoricalPricesLine,
	FMProfile,
	FMQuote,
	FMSearch,
	FMStockPrice,
} from './financial-modeling-api.model';
import { FINANCIAL_MODELING_ERROR } from './financial-modeling-error-messages.dto';

@Injectable()
export class FinancialModelingAPIService {
	private readonly apiKey = process.env.FINANCIAL_MODELING_API_KEY;
	private readonly endpointV3 = 'https://financialmodelingprep.com/api/v3';
	private readonly endpointImage = 'https://financialmodelingprep.com/image-stock';

	constructor(private readonly httpService: HttpService) {}

	/**
	 * Example: https://financialmodelingprep.com/api/v3/search-name?query=AA&limit=10&apikey=XXX
	 *
	 * @param symbolPrefix
	 * @returns searched stocks by prefix symbol
	 */
	searchAssetBySymbolPrefixName(symbolPrefix: string): Promise<FMSearch[]> {
		const modifiedPrefix = symbolPrefix.toUpperCase();
		const requestConfig: AxiosRequestConfig = {
			params: {
				query: modifiedPrefix,
				limit: 10,
				apikey: this.apiKey,
			},
		};
		return lastValueFrom(
			this.httpService.get<FMSearch[]>(`${this.endpointV3}/search-name`, requestConfig).pipe(
				map((res) =>
					res.data.map((d) => {
						return { ...d, image: `${this.endpointImage}/${d.symbol}.png` };
					})
				)
			)
		);
	}

	/**
	 * Example: https://financialmodelingprep.com/api/v3/search?query=AA&limit=10&apikey=XXX
	 *
	 * @param symbolPrefix
	 * @returns searched stocks by prefix symbol
	 */
	searchAssetBySymbolTickerPrefix(symbolPrefix: string, isCrypto = false): Promise<FMSearch[]> {
		const modifiedPrefix = (isCrypto ? `${symbolPrefix}USD` : symbolPrefix).toUpperCase();
		const requestConfig: AxiosRequestConfig = {
			params: {
				query: modifiedPrefix,
				limit: 20,
				apikey: this.apiKey,
			},
		};
		return lastValueFrom(
			this.httpService.get<FMSearch[]>(`${this.endpointV3}/search`, requestConfig).pipe(
				map((res) =>
					res.data.map((d) => {
						return { ...d, image: `${this.endpointImage}/${d.symbol}.png` };
					})
				)
			)
		);
	}

	/**
	 *
	 * @param symbol
	 * @param startDate format YYYY-MM-DD
	 * @param endDate format YYYY-MM-DD
	 */
	getAssetHistoricalPrices(
		symbol: string,
		startDate: string | Date,
		endDate: string | Date
	): Promise<FMAssetHistoricalPricesLine[]> {
		const dateStart = MomentServiceUtil.format(startDate);
		const dateEnd = MomentServiceUtil.format(endDate);

		const requestConfig: AxiosRequestConfig = {
			params: {
				apikey: this.apiKey,
				from: dateStart,
				to: dateEnd,
				serietype: 'line',
			},
		};

		return lastValueFrom(
			this.httpService
				.get<{ symbol: string; historical: FMAssetHistoricalPricesLine[] }>(
					`${this.endpointV3}/historical-price-full/${symbol}`,
					requestConfig
				)
				.pipe(
					map((res) => {
						if (!res.data || !res.data.historical) {
							throw new HttpException(FINANCIAL_MODELING_ERROR.NOT_FOUND, HttpStatus.NOT_FOUND);
						}
						return res.data.historical.sort((a, b) => (a.date < b.date ? -1 : 1));
					})
				)
		);
	}

	/**
	 * Example: https://financialmodelingprep.com/api/v3/profile/SBFM?apikey=XXX
	 *
	 * @param symbol
	 * @returns
	 */
	getStockProfile(symbol: string): Promise<FMProfile | null> {
		const requestConfig: AxiosRequestConfig = {
			params: {
				apikey: this.apiKey,
			},
		};
		return lastValueFrom(
			this.httpService.get<FMProfile[]>(`${this.endpointV3}/profile/${symbol}`, requestConfig).pipe(
				map((res) => {
					if (res.data.length > 0) {
						return res.data[0];
					}
					throw new HttpException(FINANCIAL_MODELING_ERROR.NOT_FOUND, HttpStatus.NOT_FOUND);
				})
			)
		);
	}

	/**
	 * Example: https://financialmodelingprep.com/api/v3/quote/SBFM?apikey=XXX
	 *
	 * @param symbol
	 * @returns
	 */
	getAssetQuote(symbol: string): Promise<FMQuote> {
		const modifiedSymbol = symbol.toUpperCase();
		const requestConfig: AxiosRequestConfig = {
			params: {
				apikey: this.apiKey,
			},
		};
		return lastValueFrom(
			this.httpService.get<FMQuote[]>(`${this.endpointV3}/quote/${symbol}`, requestConfig).pipe(
				map((res) => {
					if (res.data.length > 0) {
						return { ...res.data[0], symbolImage: `${this.endpointImage}/${modifiedSymbol}.png` } as FMQuote;
					}
					throw new HttpException(FINANCIAL_MODELING_ERROR.NOT_FOUND, HttpStatus.NOT_FOUND);
				})
			)
		);
	}

	/**
	 * Example: https://financialmodelingprep.com/api/v3/quote/SBFM?apikey=XXX
	 *
	 * @param symbol
	 * @returns
	 */
	async getAssetQuotes(inputSymbols: string[]): Promise<FMQuote[]> {
		const formattedSymbols = inputSymbols.map((d) => d.toUpperCase());
		const requestConfig: AxiosRequestConfig = {
			params: {
				apikey: this.apiKey,
			},
		};

		// create chunks of symbol to not
		const symbolsChunks = LodashServiceUtil.chunk(formattedSymbols, 20);

		// load FMQuote from API
		const results = await Promise.all(
			symbolsChunks.map((symbols) => {
				const formattedSymbols = symbols.map((symbol) => symbol.toUpperCase()).join(',');

				return lastValueFrom(
					this.httpService.get<FMQuote[]>(`${this.endpointV3}/quote/${formattedSymbols}`, requestConfig).pipe(
						map((res) =>
							res.data.map((d) => {
								const data: FMQuote = { ...d, symbolImage: `${this.endpointImage}/${d.symbol}.png` };
								return data;
							})
						)
					)
				);
			})
		);

		return results.reduce((acc, curr) => [...acc, ...curr]);
	}

	/**
	 * Example: https://financialmodelingprep.com/api/v3/quote-short/SBFM?apikey=XXX
	 *
	 * @param symbol
	 * @returns
	 */
	getStockPrice(symbol: string): Promise<FMStockPrice | null> {
		const requestConfig: AxiosRequestConfig = {
			params: {
				apikey: this.apiKey,
			},
		};
		return lastValueFrom(
			this.httpService.get<FMQuote[]>(`${this.endpointV3}/quote-short/${symbol}`, requestConfig).pipe(
				map((res) => {
					if (res.data.length > 0) {
						return res.data[0];
					}
					throw new HttpException(FINANCIAL_MODELING_ERROR.NOT_FOUND, HttpStatus.NOT_FOUND);
				})
			)
		);
	}
}

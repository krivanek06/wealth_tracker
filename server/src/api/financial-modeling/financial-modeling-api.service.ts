import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AxiosRequestConfig } from 'axios';
import { lastValueFrom, map } from 'rxjs';
import { FMAssetHistoricalPrices, FMProfile, FMQuote, FMSearch, FMStockPrice } from './financial-modeling-api.model';
import { FINANCIAL_MODELING_ERROR } from './financial-modeling-error-messages.dto';

@Injectable()
export class FinancialModelingAPIService {
	private readonly apiKey = process.env.FINANCIAL_MODELING_API_KEY;
	private readonly endpointV3 = 'https://financialmodelingprep.com/api/v3';
	constructor(private readonly httpService: HttpService) {}

	/**
	 * Example: https://financialmodelingprep.com/api/v3/search?query=AA&limit=10&apikey=XXX
	 *
	 * @param symbolPrefix
	 * @returns searched stocks by prefix symbol
	 */
	searchAssetBySymbolPrefix(symbolPrefix: string, isCrypto = false): Promise<FMSearch[]> {
		const modifiedPrefix = isCrypto ? `${symbolPrefix}USD` : symbolPrefix;
		const requestConfig: AxiosRequestConfig = {
			params: {
				query: modifiedPrefix,
				limit: 10,
				apikey: this.apiKey,
			},
		};
		return lastValueFrom(
			this.httpService.get<FMSearch[]>(`${this.endpointV3}/search-name`, requestConfig).pipe(map((res) => res.data))
		);
	}

	/**
	 *
	 * @param symbol
	 * @param startDate format YYYY-MM-DD
	 * @param endDate format YYYY-MM-DD
	 */
	getAssetHistoricalPrices(symbol: string, startDate: string, endDate: string): Promise<FMAssetHistoricalPrices[]> {
		const requestConfig: AxiosRequestConfig = {
			params: {
				apikey: this.apiKey,
				from: startDate,
				to: endDate,
			},
		};

		return lastValueFrom(
			this.httpService
				.get<{ symbol: string; historical: FMAssetHistoricalPrices[] }>(
					`${this.endpointV3}/historical-price-full/${symbol}`,
					requestConfig
				)
				.pipe(
					map((res) => {
						if (!res) {
							throw new HttpException(FINANCIAL_MODELING_ERROR.NOT_FOUND, HttpStatus.NOT_FOUND);
						}
						return res.data.historical;
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
		const requestConfig: AxiosRequestConfig = {
			params: {
				apikey: this.apiKey,
			},
		};
		return lastValueFrom(
			this.httpService.get<FMQuote[]>(`${this.endpointV3}/quote/${symbol}`, requestConfig).pipe(
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
	getAssetQuotes(symbols: string[]): Promise<FMQuote[]> {
		const formattedSymbols = symbols.join(',');
		const requestConfig: AxiosRequestConfig = {
			params: {
				apikey: this.apiKey,
			},
		};
		return lastValueFrom(
			this.httpService.get<FMQuote[]>(`${this.endpointV3}/quote/${formattedSymbols}`, requestConfig).pipe(
				map((res) => {
					if (res.data.length > 0) {
						return res.data;
					}
					throw new HttpException(FINANCIAL_MODELING_ERROR.NOT_FOUND, HttpStatus.NOT_FOUND);
				})
			)
		);
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

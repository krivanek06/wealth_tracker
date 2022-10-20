import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosRequestConfig } from 'axios';
import { lastValueFrom, map } from 'rxjs';
import { FMSearch } from './financial-modeling-api.model';

@Injectable()
export class FinancialModelingAPIService {
	private readonly apiKey = process.env.FINANCIAL_MODELING_API_KEY;
	private readonly endpointV3 = 'https://financialmodelingprep.com/api/v3';
	constructor(private readonly httpService: HttpService) {}

	searchStockBySymbolPrefix(symbolPrefix: string): Promise<FMSearch[]> {
		const requestConfig: AxiosRequestConfig = {
			params: {
				query: symbolPrefix,
				limit: 10,
				apikey: this.apiKey,
			},
		};
		return lastValueFrom(
			this.httpService.get<FMSearch[]>(`${this.endpointV3}/search-name`, requestConfig).pipe(map((res) => res.data))
		);
	}
}

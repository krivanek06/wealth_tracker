import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import {
	AssetGeneralFragment,
	AssetGeneralHistoricalPrices,
	AssetGeneralHistoricalPricesData,
	AssetGeneralHistoricalPricesInput,
	GetAssetGeneralForSymbolGQL,
	GetAssetGeneralHistoricalPricesDataOnDateGQL,
	GetAssetHistoricalPricesStartToEndGQL,
	SearchAssetBySymbolGQL,
	SearchAssetBySymbolTickerPrefixGQL,
} from '../graphql';

@Injectable({
	providedIn: 'root',
})
export class AssetApiService {
	constructor(
		private searchAssetBySymbolGQL: SearchAssetBySymbolGQL,
		private searchAssetBySymbolTickerPrefixGQL: SearchAssetBySymbolTickerPrefixGQL,
		private getAssetHistoricalPricesStartToEndGQL: GetAssetHistoricalPricesStartToEndGQL,
		private getAssetGeneralHistoricalPricesDataOnDateGQL: GetAssetGeneralHistoricalPricesDataOnDateGQL,
		private getAssetGeneralForSymbolGQL: GetAssetGeneralForSymbolGQL
	) {}

	searchAssetBySymbol(symbolPrefix: string): Observable<AssetGeneralFragment[]> {
		return this.searchAssetBySymbolGQL
			.fetch({
				input: symbolPrefix,
			})
			.pipe(map((res) => res.data?.searchAssetBySymbol));
	}

	searchAssetBySymbolTickerPrefix(symbolPrefix: string, isCrypto = false): Observable<AssetGeneralFragment[]> {
		return this.searchAssetBySymbolTickerPrefixGQL
			.fetch({
				input: {
					symbolPrefix,
					isCrypto,
				},
			})
			.pipe(map((res) => res.data?.searchAssetBySymbolTickerPrefix));
	}

	getAssetHistoricalPricesStartToEnd(
		input: AssetGeneralHistoricalPricesInput
	): Observable<AssetGeneralHistoricalPrices> {
		return this.getAssetHistoricalPricesStartToEndGQL
			.fetch(
				{
					input,
				},
				{
					fetchPolicy: 'network-only',
				}
			)
			.pipe(map((res) => res.data.getAssetHistoricalPricesStartToEnd));
	}

	getAssetGeneralHistoricalPricesDataOnDate(
		symbol: string,
		date: string
	): Observable<AssetGeneralHistoricalPricesData> {
		return this.getAssetGeneralHistoricalPricesDataOnDateGQL
			.fetch(
				{
					input: {
						symbol,
						date,
					},
				},
				{
					fetchPolicy: 'network-only',
				}
			)
			.pipe(map((res) => res.data.getAssetGeneralHistoricalPricesDataOnDate));
	}
}

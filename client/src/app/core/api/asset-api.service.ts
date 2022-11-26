import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import {
	AssetGeneralFragment,
	GetAssetGeneralForSymbolGQL,
	GetAssetHistoricalPricesStartToEndGQL,
	SearchAssetBySymbolGQL,
} from './../graphql/schema-backend.service';

@Injectable({
	providedIn: 'root',
})
export class AssetApiService {
	constructor(
		private searchAssetBySymbolGQL: SearchAssetBySymbolGQL,
		private getAssetHistoricalPricesStartToEndGQL: GetAssetHistoricalPricesStartToEndGQL,
		private getAssetGeneralForSymbolGQL: GetAssetGeneralForSymbolGQL
	) {}

	searchAssetBySymbol(symbolPrefix: string, isCrypto = false): Observable<AssetGeneralFragment[]> {
		return this.searchAssetBySymbolGQL
			.fetch({
				input: {
					symbolPrefix,
					isCrypto,
				},
			})
			.pipe(map((res) => res.data?.searchAssetBySymbol ?? []));
	}
}

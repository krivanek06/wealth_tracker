import { Injectable } from '@angular/core';
import {
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
}

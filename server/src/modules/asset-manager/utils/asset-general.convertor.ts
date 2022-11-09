import { FMQuote } from '../../../api';
import { AssetGeneralQuote } from '../entities';

export class AssetGeneralUtil {
	static convertFMQuoteToAssetGeneralQuote = (quote: FMQuote): AssetGeneralQuote => {
		const result: AssetGeneralQuote = {
			name: quote.name,
			timestamp: quote.timestamp,
			yearHigh: quote.yearHigh,
			yearLow: quote.yearLow,
			marketCap: quote.marketCap,
			priceAvg50: quote.priceAvg50,
			priceAvg200: quote.priceAvg200,
			avgVolume: quote.avgVolume,
			exchange: quote.exchange,
			eps: quote.eps,
			pe: quote.pe,
			earningsAnnouncement: quote.earningsAnnouncement,
			sharesOutstanding: quote.sharesOutstanding,
		};

		return result;
	};
}

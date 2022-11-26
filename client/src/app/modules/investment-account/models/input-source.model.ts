import { InvestmentAccountTransactionInputOrderType } from '../../../core/graphql';
import { InputSource } from '../../../shared/models';
export const TransactionOrderInputSource: InputSource[] = [
	{ caption: 'Order by date', value: InvestmentAccountTransactionInputOrderType.OrderByDate },
	// { caption: 'Order by created date', value: InvestmentAccountTransactionInputOrderType.OrderByCreatedAt },
	{ caption: 'Order by value', value: InvestmentAccountTransactionInputOrderType.OrderByValue },
	{ caption: 'Order by value change', value: InvestmentAccountTransactionInputOrderType.OrderByValueChange },
];

export enum SearchableAssetEnum {
	Aseet = 'Aseet',
	Crypto = 'Crypto',
}

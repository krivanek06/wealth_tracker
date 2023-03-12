import { InvestmentAccountCashChangeType, InvestmentAccountTransactionInputOrderType } from '../../../core/graphql';
import { InputSource } from '../../../shared/models';
import { NONE_INPUT_SOURCE } from './../../../shared/models';
import { SearchableAssetEnum } from './../../asset-manager/models';
export const TransactionOrderInputSource: InputSource[] = [
	{ caption: 'Order by date', value: InvestmentAccountTransactionInputOrderType.OrderByDate },
	// { caption: 'Order by created date', value: InvestmentAccountTransactionInputOrderType.OrderByCreatedAt },
	{ caption: 'Order by value', value: InvestmentAccountTransactionInputOrderType.OrderByValue },
	{ caption: 'Order by value change', value: InvestmentAccountTransactionInputOrderType.OrderByValueChange },
];

export const TransactionAssetTypeInputSource: InputSource[] = [
	{ caption: 'Asset by name', value: SearchableAssetEnum.AseetByName },
	{ caption: 'Asset by id', value: SearchableAssetEnum.AseetById },
	{ caption: 'Crypto by id', value: SearchableAssetEnum.Crypto },
];

export const CashChangeTypesInputSource: InputSource[] = [
	NONE_INPUT_SOURCE,
	{ caption: 'Deposit', value: InvestmentAccountCashChangeType.Deposit },
	{ caption: 'Withdrawal', value: InvestmentAccountCashChangeType.Withdrawal },
	{ caption: 'Asset operation', value: InvestmentAccountCashChangeType.AssetOperation },
];

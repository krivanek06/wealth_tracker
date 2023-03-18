import { AccountType } from '../../../core/graphql';
import { InputSource } from '../../../shared/models';

export const GeneralAccountTypeInputSource: InputSource[] = [
	{ caption: 'Personal account', value: AccountType.Personal },
	{ caption: 'Investment account', value: AccountType.Investment },
];

export const ACCOUNT_NAMES: { [key in AccountType]: string } = {
	PERSONAL: 'Personal Account',
	INVESTMENT: 'Investment Account',
} as const;

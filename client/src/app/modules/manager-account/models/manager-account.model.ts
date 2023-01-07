import { AccountType } from '../../../core/graphql';
import { InputSource } from '../../../shared/models';

export const GeneralAccountTypeInputSource: InputSource[] = [
	{ caption: 'Personal account', value: AccountType.PersonalAccount },
	{ caption: 'Investment account', value: AccountType.InvestmentAccount },
];

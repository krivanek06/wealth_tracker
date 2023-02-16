import { AccountType } from '../../../core/graphql';
import { InputSource } from '../../../shared/models';

export const GeneralAccountTypeInputSource: InputSource[] = [
	{ caption: 'Personal account', value: AccountType.Personal },
	{ caption: 'Investment account', value: AccountType.Investment },
];

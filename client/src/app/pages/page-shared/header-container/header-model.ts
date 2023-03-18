import { AccountIdentification, AccountType } from './../../../core/graphql';

export type AccountCreation = Pick<AccountIdentification, 'accountType' | 'name'>;

export const availableAccountCreation: AccountCreation[] = [
	{
		name: 'Personal Account',
		accountType: AccountType.Personal,
	},
	{
		name: 'Investment Account',
		accountType: AccountType.Investment,
	},
];

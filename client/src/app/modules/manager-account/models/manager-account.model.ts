import { InvestmentAccountOverviewFragment, PersonalAccountOverviewBasicFragment } from '../../../core/graphql';
import { InputSource } from '../../../shared/models';

export type GeneralAccounts = PersonalAccountOverviewBasicFragment | InvestmentAccountOverviewFragment;

export enum GeneralAccountType {
	PERSONAL_ACCOUNT = 'PERSONAL_ACCOUNT',
	INVESTMENT_ACCOUNT = 'INVESTMENT_ACCOUNT',
}
export const GeneralAccountTypeInputSource: InputSource[] = [
	{ caption: 'Personal account', value: GeneralAccountType.PERSONAL_ACCOUNT },
	{ caption: 'Investment account', value: GeneralAccountType.INVESTMENT_ACCOUNT },
];

export const getGeneralAccountType = (account?: GeneralAccounts | null): GeneralAccountType | null => {
	if (account?.__typename === 'PersonalAccount') {
		return GeneralAccountType.PERSONAL_ACCOUNT;
	}

	if (account?.__typename === 'InvestmentAccount') {
		return GeneralAccountType.INVESTMENT_ACCOUNT;
	}

	return null;
};

import { AccountType } from '../graphql';
export enum TOP_LEVEL_NAV {
	dashboard = 'dashboard',
	welcome = 'welcome',
}

export enum DASHBOARD_ROUTES {
	NO_ACCOUNT = 'no_account',
	PERSONAL_ACCOUNT = 'personal_account',
	INVESTMENT_ACCOUNT = 'investment_account',
}

export const DASHBOARD_ROUTES_BY_TYPE: { [key in AccountType]: DASHBOARD_ROUTES } = {
	PERSONAL: DASHBOARD_ROUTES.PERSONAL_ACCOUNT,
	INVESTMENT: DASHBOARD_ROUTES.INVESTMENT_ACCOUNT,
};
